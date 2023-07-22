import mongoose from 'mongoose';
import util from 'util';
import config from './config/env/index.js';
import app from './config/express.js';
import debugging from 'debug';
import dotenv from 'dotenv';
import Promise from 'bluebird';
import http from 'http';

if (config.default.env === 'development') dotenv.config({ path: './.env.development' });
else if (config.default.env === 'test') dotenv.config({ path: './.env.test' });
else dotenv.config({ path: './.env' });

const debug = debugging('index');

// Use bluebird promises in mongoose
// mongoose.Promise = Promise;
// mongoose.connect(config.default.db.uri, config.default.db.options);
// mongoose.connection.on('error', () => {
//   if (config.default.env !== 'production') throw new Error(`Unable to connect to database: ${config.default.db.uri}`);
// });

// // Print mongoose logs if this is set to true
// if (config.default.mongoose.debug) {
//   mongoose.set('debug', (collectionName, method, query, doc) => {
//     debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
//   });
// }

const { host, port } = config.default.server;

if (process.env.NODE_ENV === 'production') app.listen(8080);
else
  http.createServer(app).listen(port, host, () => {
    console.log(`Server started at host ${host} on port ${port} (${process.env.NODE_ENV})`);
  });

export default app;
