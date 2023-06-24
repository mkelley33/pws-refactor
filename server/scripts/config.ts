import path from 'path';
import dotenv from 'dotenv';
import env from '../config/env';
import mongoose from 'mongoose';

export default env.then((config) => {
  dotenv.config({ path: './.env.development' });

  Promise = require('bluebird');
  mongoose.Promise = Promise;

  const dbOptions = config.default.db.configureOptions();
  mongoose.connect(config.default.db.uri, dbOptions);

  return config;
});
