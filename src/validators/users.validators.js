const Joi = require('joi');
const { common } = require('./auth.validators');

const createUserSchema = {
    body: Joi.object({
        phoneNumber: common.phone.required(),
        email: common.email.required(),
        password: common.password.required(),
        firstName: Joi.string().min(1).max(100).required(),
        lastName: Joi.string().min(1).max(100).required(),
        cityId: common.uuid,
    }),
};

const updateUserSchema = {
    body: Joi.object({
        email: common.email,
        firstName: Joi.string().min(1).max(100),
        lastName: Joi.string().min(1).max(100),
        cityId: common.uuid,
    }),
    params: Joi.object({
        id: common.uuid.required(),
    }),
};

const getUsersSchema = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(20),
        sortBy: Joi.string().valid('createdAt', 'lastName', 'firstName', 'role', 'cityId'),
        sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
        role: Joi.string().valid('USER', 'ADMIN', 'SUPER_ADMIN'),
        cityId: common.uuid,
        email: common.email,
        q: Joi.string().max(100),
        includeCity: Joi.string().valid('true', 'false'),
    }),
};

const getUserByIdSchema = {
    params: Joi.object({
        id: common.uuid.required(),
    }),
};

const restoreAccountSchema = {
    body: Joi.object({
        phoneNumber: common.phone.required(),
    }),
};

const validateRestoreSchema = {
    body: Joi.object({
        phoneNumber: common.phone.required(),
        otpCode: Joi.string().length(6).pattern(/^\d+$/).required(),
    }),
};

module.exports = {
    createUserSchema,
    updateUserSchema,
    getUsersSchema,
    getUserByIdSchema,
    restoreAccountSchema,
    validateRestoreSchema,
};
