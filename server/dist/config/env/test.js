import dotenv from 'dotenv';
dotenv.config({ path: './.env.test' });
export default {
    env: 'test',
    jwtSecret: process.env.JWT_SECRET,
    server: {
        protocol: 'http',
        host: 'localhost',
        port: '8080',
    },
    client: {
        protocol: 'http',
        host: 'localhost',
        port: '8000',
    },
    mail: {
        address: process.env.EMAIL,
        password: process.env.EMAIL_PASS,
        sender: process.env.EMAIL_SENDER,
    },
    mongoose: {
        debug: true,
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
//# sourceMappingURL=test.js.map