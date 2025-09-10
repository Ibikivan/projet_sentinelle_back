const sessionsRepository = require("../repositories/sessions.repositories");
const citiesRepository = require("../repositories/cities.repositories");
const { ConflictError, NotFoundError, ValidationError } = require("../utils/errors.classes");
const { getUserAndSubject, getCurrentUserSession } = require("../utils/functions");
const { getNearestCityByPosition } = require("../clients/bigdatacloud.client");
const { sequelize } = require("../model");

async function startSession(userId, data) {
    return await sequelize.transaction(async (transaction) => {
        let session = data;
        const { user, subject } = await getUserAndSubject(session.subjectId, userId);
        if (subject.state !== 'active') throw new ConflictError("Can't pray on a closed subject");
        if (
            !session.cityId &&
            (!session.latitude || !session.longitude)
        ) throw new ValidationError("Latitude and longitude are required");

        session.userId = user.id;
        session.status = 'active';

        if (session.cityId && (!session.latitude || !session.longitude)) {
            const city = await citiesRepository.getCityById(session.cityId);
            session = { ...session, latitude: city.lat, longitude: city.lng, accuracy: null };
            return await sessionsRepository.createSession(session, transaction);
        };

        const nearestCity = await getNearestCityByPosition(session.latitude, session.longitude, 'en');
        if (!nearestCity.city) throw new ConflictError("Your location is not in a city");
        const cities = await citiesRepository.getCitiesByName(nearestCity.city);
        if (!cities) throw new NotFoundError("City not found");

        if (cities.length > 1) {
            const city = cities.find(city => city.countryCode === nearestCity.countryCode);
            if (!city) throw new ConflictError("Unable to find the right city");
            session = { ...session, cityId: city.id, latitude: city.lat, longitude: city.lng, accuracy: null };
        } else {
            session = { ...session, cityId: cities[0].id, latitude: cities[0].lat, longitude: cities[0].lng, accuracy: null };
        };

        return await sessionsRepository.createSession(session, transaction);
    });
};

async function getUserSessions(userId, params) {
    const status = ['active', 'completed'];
    let config = {};

    if (params.status) {
        if (!status.includes(params.status)) throw new ValidationError("Invalid parameter status 'status'");
        config = { status: params.status };
    }

    return await sessionsRepository.getSessionsByUserId(userId, config);
};

async function getSessionsBySubject(params) {
    const { subjectId } = params;
    const status = ['active', 'completed'];
    let config = {};

    if (params.status) {
        if (!status.includes(params.status)) throw new ValidationError("Invalid parameter status 'status'");
        config = { status: params.status };
    }

    return await sessionsRepository.getSessionsBySubjectId(subjectId, config);
};

async function getSessionById(id) {
    return await sessionsRepository.getSessionByIdWithAssociations(id);
};

async function getAllSessions(params) {
    // Build filter options based on query parameters
    const filterOptions = {};
    const includeOptions = [];
    const orderOptions = [];

    // Always include basic associations for consistent response
    includeOptions.push(
        { association: 'subject', attributes: ['id', 'title', 'state', 'description'] },
        { association: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
        {
            association: 'location',
            attributes: ['id', 'name', 'countryCode', 'countryName', 'continent', 'continentName'],
            where: {}
        }
    );
    
    // Status filter
    if (params.status) {
        const validStatuses = ['active', 'completed'];
        if (!validStatuses.includes(params.status))
            throw new ValidationError("Invalid status parameter. Must be 'active' or 'completed'");
        filterOptions.status = params.status;
    }
    
    // City filter
    if (params.cityId) filterOptions.cityId = params.cityId;
    
    // Country filter (through city association)
    if (params.countryCode || params.countryName) {
        if (params.countryCode) includeOptions[includeOptions.length - 1].where.countryCode = params.countryCode;
        if (params.countryName) includeOptions[includeOptions.length - 1].where.countryName = params.countryName;
    }
    
    // Continent filter (through city association)
    if (params.continent || params.continentName) {
        if (params.continent) includeOptions[includeOptions.length - 1].where.continent = params.continent;
        if (params.continentName) includeOptions[includeOptions.length - 1].where.continentName = params.continentName;
    }
    
    // Sorting options
    if (params.sortBy) {
        const validSortFields = ['createdAt', 'updatedAt', 'status', 'cityId'];
        if (!validSortFields.includes(params.sortBy))
            throw new ValidationError("Invalid sortBy parameter. Must be one of: " + validSortFields.join(', '));
        
        const sortOrder = params.sortOrder === 'desc' ? 'DESC' : 'ASC';
        orderOptions.push([params.sortBy, sortOrder]);
    } else {
        // Default sorting by creation date (newest first)
        orderOptions.push(['createdAt', 'DESC']);
    }
    
    // Pagination
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 20;
    const offset = (page - 1) * limit;
    
    if (limit > 100) throw new ValidationError("Limit cannot exceed 100");
    
    const queryOptions = {
        where: filterOptions,
        include: includeOptions,
        order: orderOptions,
        limit: limit,
        offset: offset
    };
    
    return await sessionsRepository.getAllSessionsWithFilters(queryOptions);
};

async function updateSession(id, userId, data) {
    return await sequelize.transaction(async (transaction) => {
        let value = {};
        if (data.cityId) value.cityId = data.cityId;
        if (data.description) value.description = data.description;

        const session = await getCurrentUserSession(id, userId)

        await session.update(value, transaction);
        return await sessionsRepository.getSessionById(id);
    });
};

async function endSession(id, userId) {
    return await sequelize.transaction(async (transaction) => {
        await getCurrentUserSession(id, userId)
        await sessionsRepository.completeSession(id, transaction);
    });
};

module.exports = {
    startSession,
    getUserSessions,
    getSessionsBySubject,
    getSessionById,
    getAllSessions,
    updateSession,
    endSession
};
