const {
    Router
} = require('express');
const {nanoid} = require('nanoid');
const ErrorResponse = require('../classes/error-response');
const Token = require('../db/models/Token.model');
const User = require('../db/models/User.model');
const {
    asyncHandler
} = require('../middlewares/middlewares');

const router = Router();

function initRoutes() {
    router.post('/registration', asyncHandler(registration));
    router.post('/login', asyncHandler(login));
}

async function registration(req, res, next) {
    const existingUser = await User.findOne({
        where: {
            login: req.body.login
        }
    })
    if (existingUser) {
        throw new ErrorResponse('User is already exist', 400)
    }
    const newUser = await User.create(req.body)

    res.status(200).json({
        newUser
    });
}

async function login(req, res, next) {
    const findUser = await User.findOne({
        where: req.body
    });
    if (!findUser) {
        throw new ErrorResponse('Incorrect login or password', 400)
    }
    const newToken = await Token.create({
        userId: findUser.id,
        value: nanoid(128)
    })
    res.status(200).json({
        accessToken: newToken.value
    });
}


initRoutes();

module.exports = router;