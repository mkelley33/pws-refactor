import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../../config/env/index.js';
import nodeMailer from 'nodemailer';
import User from '../models/user.model.js';
import Token from '../models/token.model.js';
import APIError from '../helpers/APIError.js';
function sendUnauthorized(res) {
    res.status(401).json({ errors: { invalidCredentials: 'The e-mail or password provided was incorrect.' } });
}
function isAuthenticated(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    }
    else {
        jwt.verify(token, config.jwtSecret, (err) => {
            err ? res.status(403).json({ errors: { token: 'Unauthorized: token expired' } }) : res.status(200).send();
            next(err);
        });
    }
}
function signin(req, res, next) {
    const { email, password } = req.body;
    User.getByEmail(email)
        .then((user) => {
        if (user && user.isVerified) {
            user.comparePassword(password, (err, isMatch) => {
                if (isMatch) {
                    const token = jwt.sign({
                        roles: user.roles,
                        email: user.email,
                        userId: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                    }, config.jwtSecret, {
                        subject: user.id,
                        expiresIn: '12h',
                    });
                    res.cookie('token', token, { httpOnly: true });
                    res.json({ userId: user.id, roles: user.roles });
                }
                else {
                    sendUnauthorized(res);
                }
                if (err)
                    next(err);
            });
        }
        else {
            sendUnauthorized(res);
        }
    })
        .catch((e) => next(e));
}
function signout(_req, res) {
    res.clearCookie('token');
    res.json({ success: true });
}
function sendResetPasswordEmail(user, token) {
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: config.mail.user,
            pass: config.mail.pass,
        },
    });
    const resetPasswordUrl = `${config.default.protocol}://${config.default.host}${config.default.port}/reset-password/${token.token}`;
    const mailOptions = {
        from: config.mail.sender,
        to: user.email,
        subject: 'Please reset your forgotten password',
        // TODO: Make a plain text version that has a link that can be copied
        text: '',
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
async function forgotPassword(req, res, next) {
    const { email } = req.body;
    const user = await User.getByEmail(email);
    const token = new Token({
        userId: user._id,
        token: crypto.randomBytes(16).toString('hex'),
    });
    token
        .save()
        .then((token) => {
        sendResetPasswordEmail(user, token);
        res.json({ success: 'E-mail sent successfully.' });
    })
        .catch((e) => next(e));
}
async function resetPassword(req, res, next) {
    const { password, token } = req.body;
    const userToken = await Token.findOne({ token });
    if (userToken) {
        const user = await User.findOne({ _id: userToken.userId });
        if (user) {
            user.password = password;
            user
                .save()
                .then((_user) => {
                if (_user)
                    res.json({ success: 'The password was reset succesfully' });
            })
                .catch((e) => next(e));
        }
        else {
            throw new APIError(`User was not found with id ${userToken.userId}`);
        }
    }
    else {
        throw new APIError('Invalid token was supplied to resetPassword.');
    }
}
export default { signin, signout, forgotPassword, resetPassword, isAuthenticated };
//# sourceMappingURL=auth.controller.js.map