'use strict';
const Order = require('../db/models/orderModel.js');
const User = require('../db/models/userModel.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(Order.tableName, {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {type: Sequelize.INTEGER, allowNull: false, references: {model: User.tableName, key: 'id'}},
      total_price: {type: Sequelize.INTEGER},
      created_at: {type: 'TIMESTAMP', allowNull: false, defaultValue: Sequelize.NOW},
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable(Order.tableName);
  }
};
