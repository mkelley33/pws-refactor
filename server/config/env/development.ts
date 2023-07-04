import dotenv from 'dotenv';
dotenv.config({ path: './.env.development' });

export default {
  env: 'development',
  server: {
    protocol: 'http',
    host: 'localhost',
    port: ':8080',
  },
  mail: {
    address: process.env.EMAIL,
    password: process.env.EMAIL_PASS,
    sender: process.env.EMAIL_SENDER,
  },
  mongoose: {
    debug: true,
  },
  jwtSecret: process.env.JWT_SECRET,
  db: {
    uri: 'mongodb://127.0.0.1:27017/api-test',
    options: {
      useNewUrlParser: true,
      socketTimeoutMS: 0,
      useUnifiedTopology: true,
      authSource: process.env.AUTH_SOURCE,
      user: process.env.PWS_USER,
      pass: process.env.PWS_PASS,
    },
  },
};
