// Largely inspired by and based on https://github.com/kunalkapadia/express-mongoose-es6-rest-api/blob/develop/server/helpers/APIError.js

import httpStatus from 'http-status';

class ExtendableError extends Error {
  isOperational: boolean;

  constructor(public message: string, public status: number, isPublic: boolean) {
    super(message);
    this.name = this.constructor.name;
    this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
    Error.captureStackTrace(this, () => this.constructor.name);
  }
}

class APIError extends ExtendableError {
  constructor(
    public message: string,
    public status: number = httpStatus.INTERNAL_SERVER_ERROR,
    public isPublic: boolean = false,
    // code and errmsg are for error messages and codes coming from mongo
    public code?: number,
    public errmsg?: string[]
  ) {
    super(message, status, isPublic);
  }
}

export default APIError;
