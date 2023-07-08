import nodeMailer from 'nodemailer';
import { Request, Response, NextFunction } from 'express';
import config from '../../config/env/index.js';

function sendContactEmail(firstName: string, lastName: string, email: string, message: string, next: NextFunction) {
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: config.default.mail.address,
      pass: config.default.mail.password,
    },
  });

  const mailOptions = {
    from: email,
    to: config.default.mail.address,
    subject: 'New contact message', // Subject line
    text: `From: ${firstName} ${lastName}\n
  ${email}\n
  ${message}\n
      `,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) return next(error);
  });

  return next('route');
}

function contact(req: Request, res: Response, next: NextFunction) {
  const { firstName, lastName, email, message } = req.body;
  sendContactEmail(firstName, lastName, email, message, next);
  return res.status(200).json({ success: true });
}

export default { contact };
