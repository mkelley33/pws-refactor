import mongoose from 'mongoose';
import util from 'util';
import config from './config/env/index.js';
import app from './config/express.js';
import debugging from 'debug';
import dotenv from 'dotenv';
import logger from './config/winston.js';

if (config.default.env === 'development') {
  dotenv.config({ path: './.env.development' });
} else if (config.default.env === 'test') {
  dotenv.config({ path: './.env.test' });
} else {
  dotenv.config({ path: './.env' });
}

logger.log('info', config.default.db.options);

const debug = debugging('index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
mongoose.connect(config.default.db.uri, config.default.db.options);
mongoose.connection.on('error', (res) => {
  console.log(res);
  throw new Error(`unable to connect to database: ${JSON.stringify(config.db)}`);
});

// print mongoose logs in dev env
if (config.default.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

app.listen(config.port, () => {
  debug(`server started on port ${config.port} (${config.env})`);
});

export default app;
