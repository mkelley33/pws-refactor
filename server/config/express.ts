import express, { Request, Response, NextFunction } from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import expressWinston from 'express-winston';
import helmet from 'helmet';
import httpStatus from 'http-status';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import * as url from 'url';
import winstonInstance from './winston.js';
import apiRouter from '../app/routes/api/index.route.js';
import config from './env/index.js';
import APIError from '../app/helpers/APIError.js';

// Ignore any red squigglies under import.meta in vscode.
// This happens because vscode doesn't recognize that we are in fact using ES2022
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();

const {
  api: { title, version, description },
} = config;

if (process.env.NODE_ENV === 'development') {
  const { host, port } = config.default.server;
  const swaggerDefinition = {
    info: { title, version, description },
    host: `${host}:${port}`,
  };

  const options = {
    swaggerDefinition,
    apis: ['./app/routes/api/**/*.ts'],
  };

  const swaggerSpec = swaggerJSDoc(options);

  app.get('/swagger.json', function (_req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

if (config.default.env === 'development') {
  app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());
app.use(methodOverride());

// // secure apps by setting various HTTP headers
app.use(helmet());

// enable detailed API logging in dev env
if (config.default.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(
    expressWinston.logger({
      winstonInstance,
      meta: true, // optional: log meta data about request (defaults to true)
      msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
      bodyBlacklist: ['pass', 'user', 'password', 'oldPassword', 'newPassword', 'confirmPassword'],
    }),
  );
}

const corsOptions = {
  origin(origin: any, callback: any) {
    callback(null, true);
  },
  credentials: true,
};
app.use(cors(corsOptions));

const allowCrossDomain = function (_req: Request, res: Response, next: NextFunction) {
  const { protocol, host, port } = config.default.server;
  const { protocol: clientProtocol, host: clientHost, port: clientPort } = config.default.client;
  res.header('Access-Control-Allow-Origin', `${protocol}://${host}${port}`);
  res.header('Access-Control-Allow-Origin', `${clientProtocol}://${clientHost}${clientPort}`);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,token');
  next();
};

app.use(allowCrossDomain);
app.use(cookieParser());

// In production serve static files using NGINX, but in development let express serve them.
if (config.default.env === 'development') {
  app.use(express.static(path.join(__dirname, '..', 'public')));
}

// Mount api routes on /api/v1 path.
app.use('/api/v1', apiRouter);

// // catch 404 and forward to error handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// Log error in winston transports except when executing test suite
if (config.default.env !== 'test') {
  app.use(
    expressWinston.errorLogger({
      winstonInstance,
    }),
  );
}

// Error handler, send stacktrace only during development
app.use((err: APIError, _req: Request, res: Response) =>
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.default.env === 'development' ? err.stack : {},
  }),
);

export default app;
