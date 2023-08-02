import { Request, Response, NextFunction } from 'express';
import config from '../../config/env/index.js';
import transporter from '../helpers/transporter.js';

function sendContactEmail(firstName: string, lastName: string, email: string, message: string, next: NextFunction) {
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
