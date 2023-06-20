import mongoose from 'mongoose';
import util from 'util';
import config from './config/env';
import app from './config/express';
import debugging from 'debug';
import dotenv from 'dotenv';


if (config.env === 'development') {
  dotenv.config({ path: './.env.development' });
} else {
  dotenv.config({ path: './.env' });
}

const debug = debugging('index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

const dbOptions = config.db.configureOptions();
// connect to mongo db
mongoose.connect(config.db.uri, dbOptions);
mongoose.connection.on('error', (res) => {
  console.log(res);
  throw new Error(`unable to connect to database: ${JSON.stringify(config.db)}`);
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    debug(`server started on port ${config.port} (${config.env})`);
  });
}

export default app;
