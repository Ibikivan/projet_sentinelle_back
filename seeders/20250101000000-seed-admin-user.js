'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin123!';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await queryInterface.bulkInsert('users', [{
      id: uuidv4(),
      phone_number: process.env.ADMIN_PHONE_NUMBER || '+237600000000',
      email: process.env.ADMIN_EMAIL || 'admin@sentinelle.app',
      password: hashedPassword,
      first_name: 'Admin',
      last_name: 'Sentinelle',
      role: 'ADMIN',
      created_at: new Date(),
      updated_at: new Date(),
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: process.env.ADMIN_EMAIL || 'admin@sentinelle.app',
    }, {});
  }
};
