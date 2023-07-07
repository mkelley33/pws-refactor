import nodeMailer from 'nodemailer';
import config from '../../config/env/index.js';
import { Request, Response, NextFunction } from 'express';

function sendContactEmail(firstName: string, lastName: string, email: string, message: string, next: NextFunction) {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.default.mail.user,
      pass: config.default.mail.pass,
    },
  });

  const mailOptions = {
    from: config.default.mail.sender,
    to: email,
    subject: 'New contact message', // Subject line
    text: `From: ${firstName} ${lastName}\n
${email}\n
${message}\n
    `,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) return next(error);
  });
}

function contact(req: Request, res: Response, next: NextFunction) {
  const { firstName, lastName, email, message } = req.body;
  sendContactEmail(firstName, lastName, email, message, next);
  res.status(200).json({ success: true });
}

export default { contact };
