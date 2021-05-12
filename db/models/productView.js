const Sequelize = require("sequelize");
const db = require('../dbSequelize.js');

const ProductView = db.define('full_product', {

    },
    {
        treatAsView: true,
        viewDefinition: `
      CREATE VIEW full_product AS (
      SELECT products.id, products.name AS name, manufactures.name AS manufacture, categories.name AS category,
      ingredients, amount, units.name AS units, price, img FROM products 
      JOIN manufactures ON manufactures.id = products.manufacture_id
      JOIN categories ON categories.id = products.category_id
      JOIN units on units.id = products.unit_id 
      ORDER BY products.id );`,
        timestamps: false,
        underscored: true
    })

module.exports = ProductView;