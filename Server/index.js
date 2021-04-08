const express = require('express');

const bodyParser = require('body-parser');

const infoDataRoutes = require('./routes/infodata');

const errorController = require('./controllers/error');
const scheduler = require('./controllers/scheduler');

const cors = require('cors');
const ports = process.env.PORT || 3000;
const { get } = require('http');

const app = require('express')();
const http = require('http').createServer(app);
const http1 = require('http').createServer(app);


app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization');
    next();
});

app.use('/infoDataItems', infoDataRoutes);

app.use(errorController.get404);

app.use(errorController.get500);

//app.use(scheduler.scheduleStart);


//app.listen(ports, () => console.log(`listening on port ${ports}`));




const io = require('socket.io')(http, {
    cors: true,
    origins: ["http://localhost:3000/"]
});
/*
const ioschedule = require('socket.io')(http1, {
    cors: true,
    origins: ["http://localhost:8080/"]
});


ioschedule.on('connection', (socket1) => {
    console.log('A new client schedule connnected');
    socket1.send('Welcome new client');
    scheduleStart1(socket1);

});
*/
io.on('connection', (socket) => {
    console.log('A new client 3000 connnected');
    socket.send('Welcome new client');
    // sendData(socket);

});

let x = true;

function sendData(socket) {
    if (x) {
        var myarray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 590) + 10);
        console.log('my array data', myarray);
        socket.emit('data1', myarray);
        x = !x;
    } else {
        socket.emit('data2', Array.from({ length: 8 }, () => Math.floor(Math.random() * 590) + 10));
        x = !x;
    }
    console.log(`data is ${x}`);
    //  setTimeout(() => {
    //sendData(socket);
    //}, 10000000);
}


//app.get('/', (req, res) => res.send('Hello World'));



http.listen(3000, () => {
    console.log('Started in 3000');
});