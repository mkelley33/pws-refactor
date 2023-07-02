import mongoose from 'mongoose';
import util from 'util';
import config from './config/env/index.js';
import app from './config/express.js';
import debugging from 'debug';
import dotenv from 'dotenv';
import Promise from 'bluebird';

if (config.default.env === 'development') {
  dotenv.config({ path: './.env.development' });
} else if (config.default.env === 'test') {
  dotenv.config({ path: './.env.test' });
} else {
  dotenv.config({ path: './.env' });
}

const debug = debugging('index');

// Use bluebird promises in mongoose
mongoose.Promise = Promise;
mongoose.connect(config.default.db.uri, config.default.db.options);
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${JSON.stringify(config.db)}`);
});

// print mongoose logs in dev env
if (config.default.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

app.listen(config.port, () => {
  console.log(`server started on port ${config.default.port} (${config.default.env})`);
});

export default app;
