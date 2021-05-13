'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.renameTable('orders', 'shop_orders');
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.renameTable('shop_orders','orders');
  }
};
