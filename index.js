const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
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


app.get('/addStrings', (req, res) => {
    res.status(200).json({
        message: localStorage.getItem(1)
    });
});
app.post('/getStrings', (req, res) => {
    mass.push(req.body.a);
    localStorage.setItem(1,mass);
    res.status(200).json({
        message: 
        `Строка \'${req.body.a}\' передана`
    });
});
app.put('/reverseArray', (req, res) => {
    let array1 = req.body.a
    let rev_array = array1.reverse()
    res.status(200).json({
        message: rev_array
    });
});
app.patch('/test', (req, res) => {
    console.log(req.body.a)
    res.status(200).json({
        message: 'OK patch'
    });
});
app.delete('/strings/:index', (req, res) => {
    mass.splice(req.params.index,1);
    localStorage.setItem(1,mass);
    res.status(200).json({
        message: localStorage.getItem(1)  
    });
});
app.delete('/strings', (req, res) => {
    mass = [];
    localStorage.setItem(1,mass);
    res.status(200).json({
        message: localStorage.getItem(1)  
    });
});

http.createServer(app).listen(80, () => {
    console.log('Server is working on port 80');
});