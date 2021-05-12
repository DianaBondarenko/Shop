const Joi = require('joi');

const detailsDTO = Joi.object().keys({
    id: Joi.number().min(1).integer()
});

module.exports = detailsDTO;
