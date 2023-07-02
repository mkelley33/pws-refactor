import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import crypto from 'crypto';
import config from '../../config/env/index.js';
import nodeMailer from 'nodemailer';
import User, { IUserDocument } from '../models/user.model.js';
import Token from '../models/token.model.js';
import APIError from '../helpers/APIError.js';

function sendUnauthorized(res: Response) {
  res.status(401).json({ errors: { invalidCredentials: 'The e-mail or password provided was incorrect.' } });
}

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, config.jwtSecret, (err: Error | null) => {
      err ? res.status(403).json({ errors: { token: 'Unauthorized: token expired' } }) : res.status(200).send();
      next(err);
    });
  }
}

function signin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  User.getByEmail(email)
    .then((user: IUserDocument) => {
      if (user && user.isVerified) {
        user.comparePassword(password, (err: Error | null, isMatch?: boolean) => {
          if (isMatch) {
            const token = jwt.sign(
              {
                roles: user.roles,
                email: user.email,
                userId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
              },
              config.jwtSecret,
              {
                subject: user.id,
                expiresIn: '12h',
              }
            );
            res.cookie('token', token, { httpOnly: true });
            res.json({ userId: user.id, roles: user.roles });
          } else {
            sendUnauthorized(res);
          }
          if (err) next(err);
        });
      } else {
        sendUnauthorized(res);
      }
    })
    .catch((e: any) => next(e));
}

function signout(_req: Request, res: Response) {
  res.clearCookie('token');
  res.json({ success: true });
}

function sendResetPasswordEmail(user: IUserDocument, token: any) {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.mail.user,
      pass: config.mail.pass,
    },
  });

  const resetPasswordUrl = `${config.protocol}://${config.host}${config.clientPort}/reset-password/${token.token}`;
  const mailOptions = {
    from: config.mail.sender, // sender address
    to: user.email, // list of receivers
    subject: 'Please reset your forgotten password', // Subject line
    // TODO: Make a plain text version that has a link that can be copied
    text: '', // plain text body
    html: `<table style="border: 0">
             <tr>
               <td style="padding-top: 30px;">Please <a href="${resetPasswordUrl}">reset your password</a> in order to gain access to the site.</td>
             </tr>
           </table>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;
  const user = await User.getByEmail(email);
  const token = new Token({
    userId: user._id,
    token: crypto.randomBytes(16).toString('hex'),
  });
  token
    .save()
    .then((token: any) => {
      sendResetPasswordEmail(user, token);
      res.json({ success: 'E-mail sent successfully.' });
    })
    .catch((e: any) => next(e));
}

async function resetPassword(req: Request, res: Response, next: NextFunction) {
  const { password, token } = req.body;
  const userToken = await Token.findOne({ token });
  if (userToken) {
    const user = await User.findOne({ _id: userToken.userId });
    if (user) {
      user.password = password;
      user
        .save()
        .then((_user: IUserDocument) => {
          if (_user) res.json({ success: 'The password was reset succesfully' });
        })
        .catch((e: any) => next(e));
    } else {
      throw new APIError(`User was not found with id ${userToken.userId}`);
    }
  } else {
    throw new APIError('Invalid token was supplied to resetPassword.');
  }
}

export default { signin, signout, forgotPassword, resetPassword, isAuthenticated };
