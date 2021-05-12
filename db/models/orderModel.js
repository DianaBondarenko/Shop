const Sequelize = require("sequelize");
const db = require('../dbSequelize.js');
const User = require('./userModel.js')

const Order = db.define('order',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false ,
        references: { model: 'User', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    total_price: {
        type: Sequelize.INTEGER
    },
    created_at: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
},{
    timestamps: false,
    underscored: true
})

Order.belongsTo(User);

module.exports = Order;