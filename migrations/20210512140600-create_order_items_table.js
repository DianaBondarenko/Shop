'use strict';
const OrderItem = require('../db/models/orderItemModel.js');
const Order = require('../db/models/orderModel.js');
const Product = require('../db/models/productModel.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(OrderItem.tableName, {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      order_id: {type: Sequelize.INTEGER, allowNull: false, references: {model: Order.tableName, key: 'id'}},
      product_id: {type: Sequelize.INTEGER, allowNull: false, references: {model: Product.tableName, key: 'id'}},
      count: {type: Sequelize.INTEGER}
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable(OrderItem.tableName);
  }
};
