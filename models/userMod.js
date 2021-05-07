const Sequelize = require("sequelize");
const db = require('../dbSequelize.js');

const User = db.define('user',{
    name: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    created_at: {
        type: Sequelize.DATE
    },
    password: {
        type: Sequelize.STRING
    }
},{
    timestamps: false
})

module.exports = User;