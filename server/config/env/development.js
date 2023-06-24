export default {
  env: 'development',
  protocol: 'http',
  host: 'localhost',
  clientPort: ':8000',
  mail: {
    getUser() { return process.env.EMAIL },
    getEmailPassword() { return process.env.EMAIL_PASS },
    getSender() { return process.env.EMAIL_SENDER },
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
