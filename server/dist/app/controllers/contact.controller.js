import nodeMailer from 'nodemailer';
import config from '../../config/env/index.js';
function sendContactEmail(firstName, lastName, email, message, next) {
    const transporter = nodeMailer.createTransport({
        service: config.default.mail.service,
        host: config.default.mail.smtp,
        port: config.default.mail.port,
        auth: {
            user: config.default.mail.address,
            pass: config.default.mail.password,
        },
    });
    const mailOptions = {
        from: email,
        to: config.default.mail.address,
        subject: 'New contact message',
        text: `From: ${firstName} ${lastName}\n
  ${email}\n
  ${message}\n
      `,
    };
    transporter.sendMail(mailOptions, (error) => {
        if (error)
            return next(error);
    });
    return next('route');
}
function contact(req, res, next) {
    const { firstName, lastName, email, message } = req.body;
    sendContactEmail(firstName, lastName, email, message, next);
    return res.status(200).json({ success: true });
}
export default { contact };
//# sourceMappingURL=contact.controller.js.map