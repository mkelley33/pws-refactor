import dotenv from 'dotenv';
import env from '../config/env';
import mongoose from 'mongoose';

export default env.then((config) => {
  const devConfig = dotenv.config({ path: './.env.development' });

  Promise = require('bluebird');
  mongoose.Promise = Promise;
  mongoose.connect(config.default.db.uri, config.default.db.options);

  return Object.assign(config, devConfig);
});
