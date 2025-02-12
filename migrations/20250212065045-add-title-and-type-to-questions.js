'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Questions', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('Questions', 'type', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Questions', 'title');
    await queryInterface.removeColumn('Questions', 'type');
  }
};
