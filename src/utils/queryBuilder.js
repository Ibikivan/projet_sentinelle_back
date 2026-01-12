const { Op } = require('sequelize');

/**
 * Build Sequelize query options from request params
 * @param {Object} model - Sequelize model
 * @param {Object} params - Query parameters
 * @param {Object} options - Configuration options
 * @returns {Object} Sequelize findAndCountAll options
 */
function buildQuery(model, params = {}, options = {}) {
    const {
        allowedFilters = [],
        allowedSorts = ['createdAt'],
        allowedIncludes = [],
        searchFields = [],
        defaultSort = 'createdAt',
        defaultOrder = 'DESC',
    } = options;

    const where = {};
    const include = [];
    const order = [];

    // Build filters
    allowedFilters.forEach(field => {
        if (params[field] !== undefined) {
            where[field] = params[field];
        }
    });

    // Search (q parameter)
    if (params.q && searchFields.length > 0) {
        where[Op.or] = searchFields.map(field => ({
            [field]: { [Op.iLike]: `%${params.q}%` }
        }));
    }

    // Include associations
    if (params.include && allowedIncludes.length > 0) {
        const requestedIncludes = params.include.split(',');
        requestedIncludes.forEach(inc => {
            const includeConfig = allowedIncludes.find(ai => ai.as === inc);
            if (includeConfig) {
                include.push(includeConfig);
            }
        });
    }

    // Sorting
    const sortBy = allowedSorts.includes(params.sortBy) ? params.sortBy : defaultSort;
    const sortOrder = ['asc', 'ASC', 'desc', 'DESC'].includes(params.sortOrder) 
        ? params.sortOrder.toUpperCase() 
        : defaultOrder;
    order.push([sortBy, sortOrder]);

    // Pagination
    const page = Math.max(1, parseInt(params.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(params.limit, 10) || 20));
    const offset = (page - 1) * limit;

    // Paranoid handling
    const paranoid = params.paranoid !== 'false';

    return {
        where,
        include: include.length > 0 ? include : undefined,
        order,
        limit,
        offset,
        paranoid,
        // Metadata for pagination response
        _meta: { page, limit },
    };
}

/**
 * Format findAndCountAll result with pagination metadata
 * @param {Object} result - Sequelize findAndCountAll result
 * @param {Object} meta - Query metadata
 * @param {string} dataKey - Key name for the data array
 * @returns {Object} Formatted response with pagination
 */
function formatPaginatedResult(result, meta, dataKey = 'items') {
    const { page, limit } = meta;
    const total = result.count;
    const totalPages = Math.ceil(total / limit);

    return {
        [dataKey]: result.rows,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
}

module.exports = {
    buildQuery,
    formatPaginatedResult,
    Op,
};
