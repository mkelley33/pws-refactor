import dotenv from 'dotenv';
dotenv.config({ path: './.env.development' });
export default {
    env: 'development',
    server: {
        protocol: 'http',
        host: 'localhost',
        port: ':8080',
    },
    client: {
        protocol: 'http',
        host: 'localhost',
        port: ':8000',
    },
    mail: {
        address: process.env.EMAIL,
        password: process.env.EMAIL_PASS,
        sender: process.env.EMAIL_SENDER,
        service: process.env.EMAIL_SERVICE,
        host: process.env.EMAIL_SMTP,
        port: process.env.EMAIL_PORT, // 587
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
//# sourceMappingURL=development.js.map