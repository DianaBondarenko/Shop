const Joi = require('joi');

const authDTO = Joi.object().keys({
    user_phone: Joi.string().max(15).pattern(/^\+?\d{10,12}$/).required(),
    user_password: Joi.string().min(6).max(60)
});
module.exports = authDTO;
