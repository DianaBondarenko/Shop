'use strict';
const Category = require('../db/models/categoryModel.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(Category.tableName, {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: {type: Sequelize.STRING(60), allowNull: false, unique:true},
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable(Category.tableName);
  }
};
