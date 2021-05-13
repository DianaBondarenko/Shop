const Sequelize = require("sequelize");
const db = require('../dbSequelize.js');
const Shop_order = require('./orderModel.js');
const Product = require('./productModel.js');

const Order_item = db.define('order_item', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    shop_order_id: {
        type: Sequelize.INTEGER,
        allowNull: false ,
        references: { model: 'Shop_order', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    product_id: {
        type: Sequelize.INTEGER,
        allowNull: false , references: { model: 'Product', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    count: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    underscored: true
})

Order_item.belongsTo(Shop_order);
Order_item.belongsTo(Product);

module.exports = Order_item;