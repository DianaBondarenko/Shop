const Sequelize = require("sequelize");
const db = require('../dbSequelize.js');

const Product = db.define('product', {
        name: {
            type: Sequelize.STRING
        },
        ingredients: {
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.INTEGER
        },
        price: {
            type: Sequelize.INTEGER
        },
        img: {
            type: Sequelize.STRING
        }
    },
    {
        timestamps: false,
        underscored: true
    }),
    Category = db.define('category', {
        name: {
            type: Sequelize.STRING
        }
    },
    {
        timestamps: false
    }),
    Manufacture = db.define('manufacture', {
        name: {
            type: Sequelize.STRING
        }
    },
    {
        timestamps: false
    }),
    Units = db.define('units', {
        name: {
            type: Sequelize.STRING
        }
    },
    {
        timestamps: false
    })

Product.belongsTo(Category);
Product.belongsTo(Manufacture);
Product.belongsTo(Units);

module.exports = Product;