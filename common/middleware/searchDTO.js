const Joi = require('joi');

const searchDTO = Joi.object().keys({
    name: Joi.string().max(100).pattern(/^[\w\'%-,]+$/i),
    manufacture: Joi.string().max(100).pattern(/^[a-z\'%-,]+$/i),
    categories: Joi.string().pattern(/^(\d,)*\d$/)
});

module.exports = searchDTO;
