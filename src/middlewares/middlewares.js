const ErrorResponse = require("../classes/error-response");
const Token = require('../db/models/Token.model');

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const syncHandler = (fn) => (req, res, next) => {
    try {
        fn(req, res, next);
    } catch (error) {
        next(error);
    }
};

const notFound = (req, _res, next) => {
    next(new ErrorResponse(`Not found - ${req.originalUrl}`, 404));
};

const requireToken = async (req, res, next) => {
    const token = req.header('x-access-token');
    if(!token) {
        throw new ErrorResponse('No token send', 403);
    }

    const tokenFromDb = await Token.findOne({
        where: {
           value: token 
        }
    })
    const userId = tokenFromDb.userId
    if(!tokenFromDb){
        throw new ErrorResponse('Token incorrect', 403);
    }
    req.token = tokenFromDb
    next()
    
}

const errorHandler = (err, _req, res, _next) => {
    console.log('Ошибка', {
        message: err.message,
        stack: err.stack,
    });
    res.status(err.code || 500).json({
        message: err.message
    });
};

module.exports = {
    asyncHandler,
    syncHandler,
    notFound,
    errorHandler,
    requireToken
};