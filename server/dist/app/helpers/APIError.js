// Largely inspired by and based on https://github.com/kunalkapadia/express-mongoose-es6-rest-api/blob/develop/server/helpers/APIError.js
import httpStatus from 'http-status';
class ExtendableError extends Error {
    message;
    status;
    isOperational;
    constructor(message, status, isPublic) {
        super(message);
        this.message = message;
        this.status = status;
        this.name = this.constructor.name;
        this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
        Error.captureStackTrace(this, () => this.constructor.name);
    }
}
class APIError extends ExtendableError {
    message;
    status;
    isPublic;
    code;
    errmsg;
    constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false, 
    // code and errmsg are for error messages and codes coming from mongo
    code, errmsg) {
        super(message, status, isPublic);
        this.message = message;
        this.status = status;
        this.isPublic = isPublic;
        this.code = code;
        this.errmsg = errmsg;
    }
}
export default APIError;
//# sourceMappingURL=APIError.js.map