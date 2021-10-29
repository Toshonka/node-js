const {Router} = require('express');
const ErrorResponse = require('../classes/error-response');
const User = require('../db/models/User.model');
const Token = require('../db/models/Token.model');
const {asyncHandler} = require('../middlewares/middlewares');

const router = Router();
function initRoutes() {
    router.get('/:id', asyncHandler(getUserById));
    router.patch('/:id', asyncHandler(updateUser));
    router.post('/logout', asyncHandler(logoutUser));
}

async function getUserById(req, res, next) {
    const UserInfo = await User.findByPk(req.params.id);
    if (!UserInfo){
        throw new ErrorResponse('No user found', 400);
    }
    res.status(200).json({
        UserInfo
    });
}

async function updateUser(req, res, next) {
    const user = await User.findByPk(req.params.id);

    if (!user) {
        throw new ErrorResponse('No user found', 404);
    } 
    await user.update(req.body);
    res.status(200).json({message: "OK"});
}
async function logoutUser(req, res, next) {
    const dropToken = await Token.destroy({
        where: {
            value: req.header('x-access-token')
        }
    })
    const allTokens = await Token.findAll()
    res.status(200).json(allTokens);
}


initRoutes();

module.exports = router;