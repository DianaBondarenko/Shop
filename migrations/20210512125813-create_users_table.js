'use strict';
const User = require('../db/models/userModel.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(User.tableName, {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: {type: Sequelize.STRING(60), allowNull: false},
      phone: { type: Sequelize.STRING(15), allowNull: false, unique: true},
      email: { type: Sequelize.STRING(60)},
      password: {type: Sequelize.STRING(60), allowNull: false},
      created_at: {type: 'TIMESTAMP', allowNull: false, defaultValue: Sequelize.NOW}
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable(User.tableName);
  }
};
