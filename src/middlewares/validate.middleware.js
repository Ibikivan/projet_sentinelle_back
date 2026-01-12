const { ValidationError } = require('../utils/errors.classes');

/**
 * Middleware factory for Joi validation
 * @param {Object} schema - Joi schema object with optional body, query, params keys
 * @returns {Function} Express middleware
 */
function validate(schema) {
    return (req, res, next) => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        };

        const errors = [];

        // Validate body
        if (schema.body) {
            const { error, value } = schema.body.validate(req.body, validationOptions);
            if (error) {
                errors.push(...error.details.map(d => ({ field: d.path.join('.'), message: d.message })));
            } else {
                req.body = value;
            }
        }

        // Validate query
        if (schema.query) {
            const { error, value } = schema.query.validate(req.query, validationOptions);
            if (error) {
                errors.push(...error.details.map(d => ({ field: `query.${d.path.join('.')}`, message: d.message })));
            } else {
                req.query = value;
            }
        }

        // Validate params
        if (schema.params) {
            const { error, value } = schema.params.validate(req.params, validationOptions);
            if (error) {
                errors.push(...error.details.map(d => ({ field: `params.${d.path.join('.')}`, message: d.message })));
            } else {
                req.params = value;
            }
        }

        if (errors.length > 0) {
            const err = new ValidationError('Validation failed');
            err.details = errors;
            return next(err);
        }

        next();
    };
}

module.exports = validate;
