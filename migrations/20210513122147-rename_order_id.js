'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('order_items', 'order_id', 'shop_order_id');
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('order_items', 'shop_order_id', 'order_id' );
  }
};
