const Sequelize = require("sequelize");
const db = require('../dbSequelize.js');

const Unit = db.define('unit', {
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

module.exports = Unit;