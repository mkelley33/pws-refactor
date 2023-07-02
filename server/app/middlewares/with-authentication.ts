import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config/env/index.js';
import { IRoleType } from '../models/user.model.js';
const env = await config;

export default function withAuthentication(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, env.jwtSecret, (err: Error | null, authorizedData?: any) => {
      if (err) {
        res.status(403).json({ errors: { token: 'Unauthorized: token expired' } });
      } else {
        res.locals.authorizedData = authorizedData;
        next();
      }
    });
  }
}

export function withAuthenticationAndRole(role: IRoleType) {
  return (req: Request, res: Response, next: NextFunction) => {
    jwt.verify(req.cookies.token, env.jwtSecret, (err: Error | null, authorizedData?: any) => {
      if (!authorizedData.roles.includes(role)) {
        return res.status(401).json({ errors: { requires: role } });
      }
      if (err) {
        res.status(403).json({ errors: { token: 'Unauthorized: token expired' } });
      } else {
        next();
      }
    });
  };
}
