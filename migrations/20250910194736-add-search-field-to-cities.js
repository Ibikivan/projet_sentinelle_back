'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Adding of the generated column search_field
    await queryInterface.sequelize.query(`
      ALTER TABLE cities
      ADD COLUMN search_field tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(toponym_name, '')), 'B')
      ) STORED;
    `);

    // Adding of the GIN index on search_field
    await queryInterface.sequelize.query(`
      CREATE INDEX idx_search ON cities USING GIN (search_field);
    `);
  },

  async down (queryInterface, Sequelize) {
    // Delete the index
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS idx_search;
    `);

    // Delete the generated column search_field
    await queryInterface.sequelize.query(`
      ALTER TABLE cities DROP COLUMN IF EXISTS search_field;
    `);
  }
};
