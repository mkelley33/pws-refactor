import dotenv from 'dotenv';
dotenv.config({ path: './.env.test' });

export default {
  env: 'test',
  protocol: 'http',
  host: 'localhost',
  port: ':8080',
  jwtSecret: process.env.JWT_SECRET,
  mail: {
    address: process.env.EMAIL,
    password: process.env.EMAIL_PASS,
    sender: process.env.EMAIL_SENDER,
  },
  db: {
    uri: 'mongodb://127.0.0.1:27017/api-test',
    options: {
      useNewUrlParser: true,
      socketTimeoutMS: 36000,
      useUnifiedTopology: true,
      authSource: process.env.AUTH_SOURCE,
      user: process.env.PWS_USER,
      pass: process.env.PWS_PASS,
    },
  },
};
