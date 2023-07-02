import dotenv from 'dotenv';
import mongoose from 'mongoose';
Promise = require('bluebird');
import User from '../app/models/user.model.js';

const config = dotenv.config({ path: './.env.development' });
mongoose.Promise = Promise;
mongoose.connect('mongodb://127.0.0.1:27017/api-test', {
  socketTimeoutMS: 0,
  authSource: process.env.AUTH_SOURCE,
  user: process.env.PWS_USER,
  pass: process.env.PWS_PASS,
});

export default config;
export { User };
