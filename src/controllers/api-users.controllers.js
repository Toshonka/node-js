const {Router} = require('express');
const ErrorResponse = require('../classes/error-response');
const User = require('../db/models/User.model');
const Token = require('../db/models/Token.model');
const {asyncHandler, requireToken} = require('../middlewares/middlewares');

const router = Router();
function initRoutes() {
    router.get('/me', asyncHandler(requireToken), asyncHandler(getUserById));
    router.patch('/me', asyncHandler(requireToken), asyncHandler(updateUser));
    router.post('/logout', asyncHandler(requireToken), asyncHandler(logoutUser));
}

async function getUserById(req, res, next) {
    const UserInfo = await User.findByPk(req.token.userId);
    if (!UserInfo){
        throw new ErrorResponse('No user found', 400);
    }
    res.status(200).json({
        UserInfo
    });
}

async function updateUser(req, res, next) {
    let user = await User.findByPk(req.token.userId);

    if (!user) {
        throw new ErrorResponse('No user found', 404);
    } 
    await user.update({
        ...req.body
    }, {
        returning: true
    });
    res.status(200).json(user);
}
async function logoutUser(req, res, next) {
    await Token.destroy({
        where: {
            value: req.header('x-access-token')
        }
    })
    res.status(200).json({message: "OK"});
}


initRoutes();

module.exports = router;