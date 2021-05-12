const Sequelize = require("sequelize");
const db = require('../dbSequelize.js');
const Category = require('./categoryModel.js');
const Manufacture = require('./manufactureModel.js');
const Unit = require('./unitModel.js');

const Product = db.define('product', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        category_id: {
            type: Sequelize.INTEGER,
            allowNull: false ,
            references: { model: 'Category', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        manufacture_id: {
            type: Sequelize.INTEGER,
            allowNull: false ,
            references: { model: 'Manufacture', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        ingredients: {
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.INTEGER
        },
        unit_id: {
            type: Sequelize.INTEGER,
            allowNull: false ,
            references: { model: 'Unit', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        price: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        img: {
            type: Sequelize.STRING
        }
    },
    {
        timestamps: false,
        underscored: true
    })

Product.belongsTo(Category);
Product.belongsTo(Manufacture);
Product.belongsTo(Unit);

module.exports = Product;