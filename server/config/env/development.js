export default {
  env: 'development',
  protocol: 'http',
  host: 'localhost',
  clientPort: ':8000',
  mail: {
    user: 'michauxkelley@gmail.com',
    pass: process.env.EMAIL_PASS,
    sender: 'Michaux Kelley <michauxkelley@gmail.com>',
  },
  MONGOOSE_DEBUG: true,
  jwtSecret: process.env.JWT_SECRET,
  db: {
    uri: 'mongodb://127.0.0.1:27017/api-development',
    configureOptions() {
      return {
        useNewUrlParser: true,
        socketTimeoutMS: 0,
        useUnifiedTopology: true,
        authSource: process.env.AUTH_SOURCE,
        user: process.env.PWS_USER,
        pass: process.env.PWS_PASS,
      }
    }
  },
  port: 8080,
};
