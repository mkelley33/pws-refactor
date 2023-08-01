import dotenv from 'dotenv';
dotenv.config({ path: './.env/production' });
export default {
    env: 'production',
    server: {
        protocol: 'https',
        host: 'pws-nodejs-65dd168ef313.herokuapp.com',
        port: 8080,
    },
    client: {
        protocol: 'https',
        www: 'www.',
        host: 'mkelley33.com',
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
        debug: false,
    },
    jwtSecret: process.env.JWT_SECRET,
    db: {
        uri: `mongodb+srv://${process.env.PWS_USER}:${process.env.PWS_PASS}@cluster0.9peoqjl.mongodb.net/?retryWrites=true&w=majority&authSource=${process.env.PWS_USER}`,
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
//# sourceMappingURL=production.js.map