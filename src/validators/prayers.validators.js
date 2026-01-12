const Joi = require('joi');
const { common } = require('./auth.validators');

const createSubjectSchema = {
    body: Joi.object({
        title: Joi.string().min(1).max(255).required(),
        description: Joi.string().max(2000),
    }),
};

const updateSubjectSchema = {
    body: Joi.object({
        title: Joi.string().min(1).max(255),
        description: Joi.string().max(2000),
    }).or('title', 'description'),
    params: Joi.object({
        id: common.uuid.required(),
    }),
};

const getSubjectsSchema = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(20),
        sortBy: Joi.string().valid('createdAt', 'title', 'state'),
        sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
        state: Joi.string().valid('active', 'close_exhausted', 'close_expired'),
        isPublic: Joi.boolean(),
    }),
};

const getSubjectByIdSchema = {
    params: Joi.object({
        id: common.uuid.required(),
    }),
};

const updateVisibilitySchema = {
    params: Joi.object({
        id: common.uuid.required(),
        visibility: Joi.string().valid('public', 'private').required(),
    }),
};

const updateStateSchema = {
    params: Joi.object({
        id: common.uuid.required(),
        state: Joi.string().valid('active', 'close_exhausted', 'close_expired').required(),
    }),
};

const handleTestimonySchema = {
    params: Joi.object({
        id: common.uuid.required(),
        action: Joi.string().valid('add', 'remove').required(),
    }),
    body: Joi.object({
        testimonyId: common.uuid.required(),
    }),
};

const handleCrewSchema = {
    params: Joi.object({
        id: common.uuid.required(),
        action: Joi.string().valid('add', 'remove').required(),
    }),
    body: Joi.object({
        prayerCrewId: common.uuid.required(),
    }),
};

const handleCommunitySchema = {
    params: Joi.object({
        id: common.uuid.required(),
        action: Joi.string().valid('add', 'remove').required(),
    }),
    body: Joi.object({
        communityId: common.uuid.required(),
    }),
};

module.exports = {
    createSubjectSchema,
    updateSubjectSchema,
    getSubjectsSchema,
    getSubjectByIdSchema,
    updateVisibilitySchema,
    updateStateSchema,
    handleTestimonySchema,
    handleCrewSchema,
    handleCommunitySchema,
};
