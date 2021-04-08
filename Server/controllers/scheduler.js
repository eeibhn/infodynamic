const express = require('express');

const bodyParser = require('body-parser');

const infoDataRoutes = require('../routes/infodata');

const errorController = require('../controllers/error');

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

//app.use('/scheduleDataItems', infoDataRoutes);


//app.use(scheduleStart);
let { pool: pool } = require('../util/database');
const QueryResult = require('pg');

const router = express();
const multer = require('multer');
const InfoDataItem = require('../models/infodata');
const Schedule = require('../models/Schedules');

const fs = require('fs');
const folder = './';
var moment = require('moment'); // require
var schedule = require('node-schedule');
const nextSchedules = require('../models/Schedules');







exports.getNextScheduleItem = async(req, res, next) => {
    try {
        const allScheduleItems = await nextSchedules.fetchNextSchedule();
        // console.log('allschedules', allScheduleItems.rows);
        res.status(200).json(allScheduleItems.rows);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 600;
        }
        next(err);
    }
};

exports.getScheduleData = async(req, res, next) => {
    console.log('getting schedule data ');
    try {
        const allScheduleItems = await Schedule.fetchScheduleData(req);
        //console.log('allschedules', allScheduleItems.rows);
        //res.status(200).json(allScheduleItems.rows);
        return allScheduleItems.rows;
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 600;
        }
        return err;
    }
};
