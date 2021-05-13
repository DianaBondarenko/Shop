'use strict';
const Product = require('../db/models/productModel.js');
const Category = require('../db/models/categoryModel.js');
const Manufacture = require('../db/models/manufactureModel.js');
const Unit = require('../db/models/unitModel.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(Product.tableName, {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false},
      category_id: {type: Sequelize.INTEGER, allowNull: false, references: {model: Category.tableName, key: 'id'}},
      manufacture_id: {type: Sequelize.INTEGER, allowNull: false, references: {model: Manufacture.tableName, key: 'id'}},
      ingredients: { type: Sequelize.STRING(1500)},
      amount: {type: Sequelize.INTEGER},
      price: {type: Sequelize.INTEGER, allowNull:false},
      unit_id: {type: Sequelize.INTEGER, allowNull: false, references: {model: Unit.tableName, key: 'id'}},
      img: {type: Sequelize.STRING(500)}
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable(Product.tableName);
  }
};
