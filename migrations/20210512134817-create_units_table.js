'use strict';
const Unit = require('../db/models/unitModel.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(Unit.tableName, {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: {type: Sequelize.STRING(60), allowNull: false, unique:true},
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable(Unit.tableName);
  }
};
