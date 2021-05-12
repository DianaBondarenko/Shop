const Sequelize = require("sequelize");
const db = require('../dbSequelize.js');

const Category = db.define('category', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            unique: true
        }
    },
    {
        timestamps: false,
        underscored: true
    })

module.exports = Category;