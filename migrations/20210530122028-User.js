'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("Users", {
      employeeId: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {type: Sequelize.STRING,allowNull: false},
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('Users');

  }
};
