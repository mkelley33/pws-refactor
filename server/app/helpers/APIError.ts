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
    public isPublic: boolean = false
  ) {
    super(message, status, isPublic);
  }
}

export default APIError;
