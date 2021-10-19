const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const {
    Sequelize,
    DataTypes,
    Model
} = require('sequelize');
const sequelize = new Sequelize('js-todo', 'postgres', 'qwerty10', {
    host: 'localhost',
    dialect: 'postgres'
});

const ToDo = sequelize.define("ToDo", {
    title: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    }
});
sequelize.sync().then(result => {
        console.log(result);
    })
    .catch(err => console.log(err));


let mass = [];
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

app.use(cors());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use((req, res, next) => {
    console.log('URL = ', req.url);
    console.log('Original_URL = ', req.origialUrl);
    console.log('METHOD = ', req.method);
    console.log('HOST = ', req.headers.host);
    console.log('InSecure = ', req.secure);
    console.log('BODY', req.body);
    console.log('QUERY', req.query);

    next();
});


app.get('/get-todos', (req, res) => {
        ToDo.findAll().then(ToDos => {
            res.status(200).json({ToDos});
        }).catch(function (err) {
            console.log("findAll failed with error: " + err);
            return null;

        });
});
app.get('/get-todos/:index', (req, res) => {
    const id = req.params.index;
    ToDo.findByPk(id
    ).then(ToDos => {
        res.status(200).json({ToDos});
    }).catch(function (err) {
        console.log("delete failed with error: " + err);
        return 0;
        // handle error;
    });
});
app.post('/post-todos', (req, res) => {
    ToDo.create({
        title: req.body.title,
        description: req.body.description
    }).then(ToDo => {
        res.status(200).json(ToDo.title);
    }).catch(function (err) {
        console.log("create failed with error: " + err);
        return 0;
    });
});
app.put('/put-todos', (req, res) => {
    let array1 = req.body.a
    let rev_array = array1.reverse()
    res.status(200).json({
        message: rev_array
    });
});
app.patch('/patch-todos/:index', (req, res) => {
    const id = req.params.index;
   ToDo.update({title: req.body.title, description: req.body.description},
       { where: { id: id } }
   ).then(() => {
        res.status(200).json({message: "OK"});
   }).catch(function (err) {
    res.status(500).json({message: "Пипяо"});
       console.log("update failed with error: " + err);
       return 0;
 });
});
app.delete('/delete-todos/:index', (req, res) => {
    const id = req.params.index;
    ToDo.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.status(200).json({
            message: `Объект ${id} удалён`
        });
    }).catch(function (err) {
        console.log("delete failed with error: " + err);
        return 0;
        // handle error;
    });
});
// app.delete('/delete-todos', (req, res) => {
//     mass = [];
//     localStorage.setItem(1, mass);
//     res.status(200).json({
//         message: localStorage.getItem(1)
//     });
// });

http.createServer(app).listen(80, () => {
    console.log('Server is working on port 80');
});