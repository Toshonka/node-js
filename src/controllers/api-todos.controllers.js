const {
    Router
} = require('express');
const ErrorResponse = require('../classes/error-response');
const ToDo = require('../db/models/ToDo.model');
const User = require('../db/models/User.model');
const {
    asyncHandler,
    requireToken
} = require('../middlewares/middlewares');

const router = Router();

function initRoutes() {
    router.get('/', asyncHandler(requireToken), asyncHandler(getToDos));
    router.get('/:id', asyncHandler(requireToken), asyncHandler(getToDoById));
    router.post('/', asyncHandler(requireToken), asyncHandler(createToDo));
    router.delete('/:id', asyncHandler(requireToken), asyncHandler(deleteToDoById));
    router.delete('/', asyncHandler(requireToken), asyncHandler(deleteToDos));
    router.patch('/:id', asyncHandler(requireToken), asyncHandler(patchToDos));
}

async function getToDos(req, res, next) {
    const todos = await ToDo.findAll({
        where: {
            userId: req.token.userId
        }
    });

    res.status(200).json({
        todos
    });
}

async function getToDoById(req, res, next) {
    const todo = await ToDo.findByPk({
        where: {
            id: req.params.id,
            userId: req.token.userId
        }
    });

    if (!todo) {
        throw new ErrorResponse('No todo found', 404);
    }

    res.status(200).json(todo);
}
async function createToDo(req, res, next) {
    const todo = await ToDo.create({
        ...req.body,
        userId: req.token.userId
    });

    res.status(200).json(todo);
}
async function deleteToDoById(req, res, next) {
    const todo = await ToDo.findByPk({
        where: {
            id: req.params.id,
            userId: req.token.userId
        }
    });

    if (!todo) {
        throw new ErrorResponse('No todo found', 404);
    }
    await todo.destroy();

    res.status(200).json(todo);
}
async function deleteToDos(req, res, next) {
    await ToDo.destroy({
        truncate: true
    }, {
        where: {
            userId: req.token.userId
        }
    })
    res.status(200).json({
        message: 'OK'
    });
}
async function patchToDos(req, res, next) {
    let todo = await ToDo.findOne({
        where: {
            id: req.params.id,
            userId: req.token.userId
        }
    });

    if (!todo) {
        throw new ErrorResponse('No todo found', 404);
    }
    const id = req.params.index;
    todo = await todo.update({
        ...req.body
    }, {
        returning: true
    });
    res.status(200).json(todo);
}

initRoutes();

module.exports = router;