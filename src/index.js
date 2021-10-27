const express = require('express');
const http = require('http');
const cors = require('cors');
const apiRouter = require('./controllers/api-todos.controllers');
//const testRouter = require('./Controllers/test.controller');
const { notFound, errorHandler} = require('./middlewares/middlewares');
const { initDB } = require('./db');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
initDB();

app.use((req, res, next) => {
  console.log('URL = ', req.url);
  console.log('Original_URL = ', req.originalUrl);
  console.log('METHOD = ', req.method);
  console.log('HOST = ', req.headers.host);
  console.log('IsSecure = ', req.secure);
  console.log('BODY', req.body);
  console.log('QUERY', req.query);

  next();
});

app.use('/api/todos', apiRouter);
//app.use('/test', testRouter);

app.use(notFound);
app.use(errorHandler);

http.createServer(app).listen(80, () => {
    console.log('Server is working on port 80');
});