const Joi = require('joi');

// Common patterns
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const phonePattern = /^\+?[1-9]\d{1,14}$/;

// Common field schemas
const uuid = Joi.string().pattern(uuidPattern).messages({
    'string.pattern.base': '{{#label}} must be a valid UUID',
});

const phone = Joi.string().pattern(phonePattern).messages({
    'string.pattern.base': '{{#label}} must be a valid E.164 phone number',
});

const email = Joi.string().email();

const password = Joi.string().min(8).max(100);

// Pagination schema (reusable for query params)
const pagination = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sortBy: Joi.string(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

// Auth schemas
const loginSchema = {
    body: Joi.object({
        phoneNumber: phone.required(),
        password: password.required(),
    }),
};

const changePasswordSchema = {
    body: Joi.object({
        oldPassword: password.required(),
        newPassword: password.required(),
    }),
};

const forgotPasswordSchema = {
    body: Joi.object({
        phoneNumber: phone.required(),
    }),
};

const verifyOtpSchema = {
    body: Joi.object({
        otpCode: Joi.string().length(6).pattern(/^\d+$/).required(),
    }),
};

const verifyPasswordOtpSchema = {
    body: Joi.object({
        phoneNumber: phone.required(),
        otpCode: Joi.string().length(6).pattern(/^\d+$/).required(),
    }),
};

const resetPasswordSchema = {
    body: Joi.object({
        otpId: uuid.required(),
        newPassword: password.required(),
    }),
};

const changePhoneNumberSchema = {
    body: Joi.object({
        newPhoneNumber: phone.required(),
    }),
};

module.exports = {
    loginSchema,
    changePasswordSchema,
    forgotPasswordSchema,
    verifyOtpSchema,
    verifyPasswordOtpSchema,
    resetPasswordSchema,
    changePhoneNumberSchema,
    // Export common schemas for reuse
    common: { uuid, phone, email, password, pagination },
};
