const {Router} = require('express');
const ErrorResponse = require('../classes/error-response');
const ToDo = require('../db/models/ToDo.model');
const {asyncHandler} = require('../middlewares/middlewares');

const router = Router();
 //                                     ПЕРЕДЕЛАТЬ МЕТОДЫ + токен
function initRoutes() {
    router.get('/', asyncHandler(getToDos));
    router.get('/:id', asyncHandler(getToDoById));
    router.post('/', asyncHandler(createToDo));
    router.delete('/:id', asyncHandler(deleteToDoById));
    router.delete('/', asyncHandler(deleteToDos));
    router.patch('/:id', asyncHandler(patchToDos));
}

async function getToDos(req, res, next) {
    const todos = await ToDo.findAll();

    res.status(200).json({
        todos
    });
}

async function getToDoById(req, res, next) {
    const todo = await ToDo.findByPk(req.params.id);

    if (!todo) {
        throw new ErrorResponse('No todo found', 404);
    }

    res.status(200).json(todo);
}
async function createToDo(req, res, next) {
    const todo = await ToDo.create(req.body);

    res.status(200).json(todo);
}
async function deleteToDoById(req, res, next) {
    const todo = await ToDo.findByPk(req.params.id);

    if (!todo) {
        throw new ErrorResponse('No todo found', 404);
    }
    await todo.destroy();

    res.status(200).json(todo);
}
async function deleteToDos(req, res, next) {
    await ToDo.destroy({
        truncate: true
    })
    res.status(200).json({message: 'OK'});
}
async function patchToDos(req, res, next) {
    let todo = await ToDo.findByPk(req.params.id);

    if (!todo) {
        throw new ErrorResponse('No todo found', 404);
    } 
    const id = req.params.index;
    await todo.update(req.body);
    res.status(200).json({message: "OK"});
}

initRoutes();

module.exports = router;