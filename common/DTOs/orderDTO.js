const Joi = require('joi');

const orderDTO = Joi.object().keys({
    products: Joi.array().items({
        id: Joi.number().min(1).required(),
        count: Joi.number().min(1).required()
    }).required()
});
module.exports = orderDTO;