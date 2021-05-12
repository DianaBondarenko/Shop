const orderModel = require('../../db/services/orderService.js');
const NotFound = require('../errors/notFound.js');
const Forbidden = require('../errors/forbidden.js');

const authMiddleWare = async (req, res, next) => {
    const {user_phone, user_password} = req.headers;
    const user = await orderModel.getUser(user_phone);
    if (user) {
        if (user.password === user_password) {
            res.locals.user = user;
            res.locals.isAuthenticated = true;
            next();
        } else {
            res.locals.isAuthenticated = false;
            next(new Forbidden(`User's password is wrong`));
        }
    }
    else {
        res.locals.isAuthenticated = false;
        next(new NotFound('This user doesn\'t exist'));
    }
}
module.exports = authMiddleWare;
