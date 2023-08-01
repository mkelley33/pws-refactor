import nodeMailer from 'nodemailer';
import config from '../../config/env/index.js';
const transporter = nodeMailer.createTransport({
    service: config.default.mail.service,
    host: config.default.mail.smtp,
    port: config.default.mail.port,
    auth: {
        user: config.default.mail.address,
        pass: config.default.mail.password,
    },
});
export default transporter;
//# sourceMappingURL=transporter.js.map