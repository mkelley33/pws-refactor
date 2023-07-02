import User, { IUserDocument, ROLE_ADMIN } from '../models/user.model.js';
import Token from '../models/token.model.js';
import nodeMailer from 'nodemailer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../../config/env/index.js';
import { NextFunction, Request, Response } from 'express';
import APIError from '../helpers/APIError.js';
import httpStatus from 'http-status';
import mongoose from 'mongoose';

interface IError {
  error: string;
}

function sendVerificationEmail(user: IUserDocument) {
  // TODO: add a timestamp to the token so that there is a way to retrieve the latest one created for the user
  const token = new Token({
    userId: user._id,
    token: crypto.randomBytes(16).toString('hex'),
  });
  token.save();
  if (process.env.NODE_ENV === 'test') {
    // TODO: possibly write token to a file from which it
    // can later be read in tests
  }

  let smtpConfig = {};
  if (['development', 'test'].includes(process.env.NODE_ENV ?? 'development')) {
    console.log(process.env.NODE_ENV);
    // This is the smtp config for mailcatcher
    smtpConfig = {
      host: '127.0.0.1',
      port: 1025,
      // TODO: Secure upgrade later with STARTTLS
      secure: false,
      auth: {
        // user and pass can be anything but blank
        type: 'basic',
        user: 'user',
        pass: 'password',
      },
    };
  } else {
    smtpConfig = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: config.default.mail.user,
        pass: config.default.mail.password,
      },
    };
  }

  const transporter = nodeMailer.createTransport(smtpConfig);
  const verificationUrl = `${config.default.protocol}://${config.default.host}${config.default.port}/email-verification/${token.token}`;
  console.log(verificationUrl);
  const mailOptions = {
    from: config.default.mail.sender, // sender address
    to: user.email, // list of receivers
    subject: 'Please verify your e-mail to activate your account', // Subject line
    // TODO: Make a plain text version that has a link that can be copied
    text: '', // plain text body
    html: `<table style="border: 0">
                <tr>
                  <td style="background-color: #068ab3; color: #ffffff; height: 75px; padding-left: 30px; padding-right: 30px;"><h1>*Verify your e-mail address, please.</h1></td>
                </tr>
                <tr>
                  <td style="padding-top: 30px;">Please <a href="${verificationUrl}">verify your email address</a> in order to gain access to the site.</td>
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

// function search(req, res, next) {
//   // TODO: implement user search to find by e-mail, last name, first name, or role (ie. find all admins)
//   // TODO: only allow admin to perform user search.
// }

function verification(req: Request, res: Response, next: NextFunction) {
  Token.findOne({ token: req.params.token })
    .then((token) => {
      // If a token exists then a user will exist that matches it, so no need to
      // check for a not found error
      if (token) {
        User.findOne({ _id: token.userId }).then((user) => {
          if (user) {
            if (user.isVerified) {
              return res.status(400).json({ message: 'already verified' });
            }
            user.isVerified = true;
            user.verifiedAt = new Date();
            user.save().then(() => {
              res.status(200).json({ message: 'verified' });
            });
          }
        });
      }
    })
    .catch((err) => {
      // TODO: Log err in verification function of user.controller.js
      return res.status(400).json({
        message: 'expired token',
      });
    });
}

function resendVerificationEmail(req: Request, res: Response, next: NextFunction) {
  // TODO: implement way to prevent user from being verified if banned
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) sendVerificationEmail(user);
      res.json({ message: 'verification email resent' });
    })
    .catch((err) => {
      // TODO: Log err in resendVerificationEmail function of user.controller.js
      res.status(400).json({
        message: 'user not found',
      });
    });
}

function getProfile(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  jwt.verify(token, config.jwtSecret, async (err: any, decoded: any) => {
    if (err) {
      next(err);
    }
    const { userId } = decoded;
    const user = await User.findById(userId).exec();
    if (user) {
      res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userId: user._id,
        roles: user.roles,
      });
    } else {
      // TODO: Log err that user was not found in getProfile function of user.controller.ts
    }
  });
}

function create(req: Request, res: Response, next: NextFunction) {
  const { firstName, lastName, username, email, password, phone } = req.body;
  new User({ firstName, lastName, username, email, password, phone })
    .save()
    .then((savedUser) => {
      sendVerificationEmail(savedUser);
      res.json(savedUser);
    })
    .catch((e) => next(e));
}

const update = (req: Request, res: Response, next: NextFunction): void => {
  const { firstName, lastName, email, roles, currentPassword, password } = req.body;
  const errors: IError[] = [];
  const userId = req.params.userId;
  User.findById(userId).then(async (user) => {
    if (user) {
      if (user?.isVerified && currentPassword) {
        user.comparePassword(currentPassword, (err, isMatch) => {
          if (err) next(err);
          isMatch ? (user.password = password) : errors.push({ error: 'invalid credentials' });
        });

        const isUserAdmin = user.roles.default.includes(ROLE_ADMIN);
        const propertiesToUpdate = { firstName, lastName, email };
        const updatedUser = Object.assign(user, { propertiesToUpdate });

        if (isUserAdmin) updatedUser.roles = roles;

        const savedUser = await user.save().catch((e) => next(e));

        res.status(httpStatus.OK);
        res.json({ savedUser, errors });
      } else {
        throw new APIError('User is not verified.', httpStatus.UNPROCESSABLE_ENTITY, false);
      }
    } else {
      throw new APIError(`User does not exist with id of ${userId}`);
    }
  });
};

function list(req: Request, res: Response, next: NextFunction) {
  // TODO: Allow limit to be set up to a reasonable maximum.
  // TODO: Only allow admin to list users.
  const { limit = 50, skip = 0 } = req.query;
  User.list(+limit, +skip)
    .then((users) => {
      res.json(users);
    })
    .catch((e) => next(e));
}

async function remove(req: Request, res: Response, next: NextFunction) {
  // TODO: Only allow admin to delete a user
  // TODO: Allow user to remove self (delete account).
  const { userId } = req.params;
  if (userId) {
    const user = await User.get(new mongoose.Types.ObjectId(userId));
    if (user) {
      user
        .deleteOne()
        .then((deletedUser) => res.json(deletedUser))
        .catch((e) => next(e));
    } else {
      throw new APIError(`[userNotFound] User with id ${userId} was not found, and thus not deleted.`);
    }
  } else {
    throw new APIError(`[userNotFound] The property userId was not on the request parameters, and thus not deleted.`);
  }
}

async function get(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.params;
  const user = await User.findById(userId);
  user ? res.json({ user }) : next(new APIError(`User was not found by id ${userId}`));
}

export default { create, update, list, remove, verification, resendVerificationEmail, getProfile, get };
