import express, { NextFunction, Request, Response } from 'express';
import userRoutes from './user.route.js';
import authRoutes from './auth.route.js';
import photoRoutes from './photo.route.js';
import photoAlbumRoutes from './photo-albums.route.js';
import recaptchaRoutes from './recaptcha.route.js';
import contactRoutes from './contact.route.js';
import APIError from '../../helpers/APIError.js';

const router = express.Router(); // eslint-disable-line new-cap

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/photos', photoRoutes);
router.use('/photo-albums', photoAlbumRoutes);
router.use('/recaptcha', recaptchaRoutes);
router.use('/contact', contactRoutes);

// Source: https://github.com/gothinkster/node-express-realworld-example-app/blob/master/routes/api/index.js
router.use(function (err: APIError, req: Request, res: Response, next: NextFunction) {
  if (err.name === 'ValidationError') {
    return res.status(422).json({ ...err });
  } else if (err.name === 'MongoError') {
    if (err.code === 11000 && err.errmsg && err.errmsg.includes('email_1')) {
      res.status(422).json({ errors: { email: 'That e-mail is already being used.' } });
    }
  } else {
    console.log(JSON.stringify(res), 'res >>>');
    res.status(422).json({ errors: { email: 'Something went wrong.' } });
  }
  console.log(err);
  return next(err);
});

export default router;
