const Sequelize = require("sequelize");
const db = require('../dbSequelize.js');
const Order = require('./orderModel.js');
const Product = require('./productModel.js');

const Order_item = db.define('order_item', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    order_id: {
        type: Sequelize.INTEGER,
        allowNull: false ,
        references: { model: 'Order', key: 'id' },
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

Order_item.belongsTo(Order);
Order_item.belongsTo(Product);

module.exports = Order_item;