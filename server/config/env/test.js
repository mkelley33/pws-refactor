import dotenv from 'dotenv';
dotenv.config({ path: './.env.test' });

export default {
  env: 'test',
  jwtSecret: process.env.JWT_SECRET,
  db: {
    uri: 'mongodb://localhost/api-test',
    options: {
      useNewUrlParser: true,
      socketTimeoutMS: 0,
      useUnifiedTopology: true,
      authSource: process.env.AUTH_SOURCE_TEST,
      user: process.env.PWS_USER_TEST,
      pass: process.env.PWS_PASS_TEST,
    },
  },
  port: 4040,
};
