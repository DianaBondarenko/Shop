'use strict';
const Manufacture = require('../db/models/manufactureModel.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(Manufacture.tableName, {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: {type: Sequelize.STRING(100), allowNull: false, unique:true},
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable(Manufacture.tableName);
  }
};
