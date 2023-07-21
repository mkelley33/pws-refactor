import dotenv from 'dotenv';
dotenv.config({ path: './.env/production' });

export default {
  env: 'development',
  server: {
    protocol: 'https',
    host: 'pws-nodejs-65dd168ef313.herokuapp.com',
    port: ':8080',
  },
  client: {
    protocol: 'https',
    host: 'mkelley33.com',
  },
  mail: {
    address: process.env.EMAIL,
    password: process.env.EMAIL_PASS,
    sender: process.env.EMAIL_SENDER,
    service: process.env.EMAIL_SERVICE, // 'gmail'
    host: process.env.EMAIL_SMTP, // 'smtp.gmail.com'
    port: process.env.EMAIL_PORT, // 587
  },
  mongoose: {
    debug: true,
  },
  jwtSecret: process.env.JWT_SECRET,
  db: {
    uri: `mongodb+srv://pws-user:${process.env.PWS_PASS}@cluster0-plswm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
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
