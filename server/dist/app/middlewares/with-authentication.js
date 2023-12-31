import jwt from 'jsonwebtoken';
import config from '../../config/env/index.js';
const env = await config;
export default function withAuthentication(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    }
    else {
        jwt.verify(token, env.jwtSecret, (err, authorizedData) => {
            if (err) {
                res.status(403).json({ errors: { token: 'Unauthorized: token expired' } });
            }
            else {
                res.locals.authorizedData = authorizedData;
                next();
            }
        });
    }
}
export function withAuthenticationAndRole(role) {
    return (req, res, next) => {
        jwt.verify(req.cookies.token, env.jwtSecret, (err, authorizedData) => {
            if (!authorizedData.roles.includes(role)) {
                return res.status(401).json({ errors: { requires: role } });
            }
            if (err) {
                res.status(403).json({ errors: { token: 'Unauthorized: token expired' } });
            }
            else {
                next();
            }
        });
    };
}
//# sourceMappingURL=with-authentication.js.map