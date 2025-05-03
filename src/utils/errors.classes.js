/**
 * Base class for application errors.
 * @param {number} statusCode - HTTP status code (e.g. 400,404,500)
 * @param {string} errorCode  - Internal code (e.g. 'NOT_FOUND')
 * @param {string} message    - Human-readable message
 */
class ServerError extends Error {
    constructor(statusCode, errorCode, message) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }
};

class NotFoundError extends ServerError {
    constructor(message = 'Resource not Found') {
        super(404, 'NOT_FOUND', message);
    }
}

class ValidationError extends ServerError {
    constructor(message = 'Validation failed') {
        super(400, 'BAD_REQUEST', message);
    }
}

class AuthentificationError extends ServerError {
    constructor(message = 'Authentification required') {
        super(401, 'UNAUTHORIZED', message);
    }
}

class AuthorizationError extends ServerError {
    constructor(message = 'Access Denied') {
        super(403, 'FORBIDDEN', message);
    }
}

class ServiceUnavailableError extends ServerError {
    constructor(message = 'Service unavailable') {
        super(503, 'SERVICE_UNAVAILABLE', message);
    }
}

class ConflictError extends ServerError {
    constructor(message = 'Conflict occurred') {
        super(409, 'CONFLICT', message);
    }
}

class GoneError extends ServerError {
    constructor(message = 'Resource is gone') {
        super(410, 'GONE', message);
    }
}

class TooManyRequestsError extends ServerError {
    constructor(message = 'Too many requests') {
        super(429, 'TOO_MANY_REQUESTS', message);
    }
}

module.exports = {
    ServerError,
    NotFoundError,
    ValidationError,
    AuthentificationError,
    AuthorizationError,
    ServiceUnavailableError,
    ConflictError,
    GoneError,
    TooManyRequestsError
}
