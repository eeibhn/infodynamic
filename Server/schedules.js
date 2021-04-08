const express = require('express');

const bodyParser = require('body-parser');

const infoDataRoutes = require('./routes/infodata');

const errorController = require('./controllers/error');
const scheduler = require('./controllers/scheduler');
const Schedule = require('./models/Schedules');
const schedule = require('node-schedule');

const cors = require('cors');
const ports = process.env.PORT || 8080;
const { get } = require('http');
const { throwError } = require('rxjs');

const app = require('express')();
const http1 = require('http').createServer(app);
var moment = require('moment'); // require
const InfoData = require('./models/InfoData');
var socket1;

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization');
    next();
});

http1.listen(8080, () => {
    console.log('Started in 8080');
});



const ioschedule = require('socket.io')(http1, {
    cors: true,
    origins: ["http://localhost:8080/"]
});

ioschedule.on('connection', (socket) => {
    console.log('A socket client connnected');
    socket.send('Welcome new client');
    socket.on('newschedule', (msg, msg2) => {
        console.log('got it', msg, msg2);
        scheduleUpdate(socket, msg);
    });
    console.log('starting schedule outside ');
    scheduleStart(socket);
});

/*
const ioschedule1 = require('socket.io')(http1, {
    cors: true,
    origins: ["http://localhost:8080/"]
});


ioschedule1.on('connection', (socket) => {
    socket.send('Welcome new client');
    socket.on('newschedule', (msg) => {
            ioschedule1.emit('newschedule', 'got it working');
        })
        //scheduleStart1(socket, name);
});

*/


async function scheduleUpdate(socket, name, freq) {

    try {
        scheduleData = await InfoData.fetchThisSchedule(name);
        scheduleData.rows[0].frequency = freq;

        console.log('scheduleData update1', scheduleData.rows[0]);
        if (scheduleData.rows[0].frequency !== null) {
            const startTime = new Date(Date.now()).getSeconds();
            console.log('start time', startTime, 'name', name);
            const job = schedule.scheduleJob({ second: startTime }, function() {
                sendSocket(socket, name);
            })
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 600;
        }
    }
}



async function scheduleStart(socket) {
    console.log('Schedule Start');
    //socket.emit('data2', 11111111);
    try {
        const scheduleList = await Schedule.fetchAllSchedules();
        console.log('schedule list', scheduleList.rows);
        //  res.status(200).json(scheduleList.rows);


        scheduleList.rows.forEach((element, index) => {
            const startTime = new Date(Date.now()).getSeconds();
            console.log('start time', startTime);
            //var delay = (element.frequency * index) + 1;
            // const myrule = '1' + delay + ' * * * * * ';
            // const endTime = new Date(startTime.getTime() + 100000);

            const job = schedule.scheduleJob({ second: startTime }, function() {
                sendSocket(socket, element.name);
            })
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 600;
        }
    }
}

async function sendSocket(socket, name) {

    scheduleData = await Schedule.fetchScheduleData(name);
    console.log('name', name);
    for (index = 0; index < scheduleData.rows.length; index++) {
        scheduleData.rows[index].schedulename = name + '-' + moment().format('DDMMYYYYhhmmss').toString();
        // console.log('Time Creating a Report!', scheduleData.rows[index]);

    };
    console.log('Time for sending new data!', name);
    socket.emit(name, scheduleData.rows);
}


/*
module.exports = class Scheduler {
        constructor(id, item) {
            this.id = id;
            this.item = item;
        }
        static scheduleSocketStart(name) {
            console.log('A socket1 client connnected');
            const ioschedule1 = require('socket.io')(http1, {
                cors: true,
                origins: ["http://localhost:8080/"]
            });


            ioschedule1.on('connection', (socket) => {
                socket.send('Welcome new client');
                scheduleStart1(socket, name);
            });
            console.log('done ');
            return true;
        }
    } *
    /
async function scheduleStart1(socket) {
    console.log('A new send schedule client connnected');
    socket.emit('data2', 11111111);
    try {
        const scheduleList = await Schedule.fetchAllSchedules();
        console.log('schedule list', scheduleList.rows);
        //  res.status(200).json(scheduleList.rows);


        scheduleList.rows.forEach((element, index) => {
            const startTime = new Date(Date.now());
            console.log('element frequency', element.frequency);
            var delay = (element.frequency * 14 * index) + 1;
            const myrule = '/
' + delay + ' * * * * * ';
const endTime = new Date(startTime.getTime() + 100000);
console.log('start time', startTime, 'name', element.name, myrule, delay);
const job = schedule.scheduleJob({ second: delay }, function() {
sendSocket1(socket, element.name);
})
})
}
catch (err) {
    if (!err.statusCode) {
        err.statusCode = 600;
    }
}
}

async function sendSocket1(socket, name) {
    scheduleData = await Schedule.fetchScheduleData(name);
    //console.log('name', name);
    for (index = 0; index < scheduleData.rows.length; index++) {
        scheduleData.rows[index].schedulename = name + '-' + moment().format('DDMMYYYYhhmmss').toString();
        // console.log('Time Creating a Report!', scheduleData.rows[index]);

    };
    console.log('Time for drinking it!', name);
    socket.emit('data2', scheduleData.rows);
}*/