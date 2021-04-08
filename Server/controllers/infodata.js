const pool = require('../util/database').pool;
const QueryResult = require('pg');

const express = require('express');
const router = express();
const multer = require('multer');
const InfoDataItem = require('../models/InfoData');
const Schedule = require('../models/Schedules');
//const Scheduler = require('../Schedules');

const fs = require('fs');
const folder = './';
const path = require('path');
const schedule = require('node-schedule');




exports.gettest = async(req, res, next) => {
    try {
        const allInfoDataItems = await pool.query('SELECT * FROM Roames');
        res.status(200).json(allInfoDataItems.rows);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 700;
        }
        next(err);
    }
};


exports.getPDF = (req, res, next) => {
    try {
        return "file:///C:/Users/eeibh/Documents/Virtugrp/VIOT/Angular/Infodynamics/vi-info/src/app/Resources/Bill.pdf";
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 700;
        }
        next(err);
    }
};


exports.getAllInfoDataItems = async(req, res, next) => {
    try {
        const allInfoDataItems = await InfoDataItem.fetchAll();
        res.status(200).json(allInfoDataItems.rows);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 600;
        }
        next(err);
    }
};

exports.getAllNEMItems = async(req, res, next) => {
    try {
        const allNEMItems = await InfoDataItem.fetchAllNEM();
        res.status(200).json(allNEMItems.rows);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 600;
        }
        next(err);
    }
};

exports.getAllAreaItems = async(req, res, next) => {
    try {

        const allAreaItems = await InfoDataItem.fetchAllArea();
        console.log('area items', allAreaItems.rows);
        res.status(200).json(allAreaItems.rows);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 600;
        }
        next(err);
    }
};

exports.getMeterData = async(req, res, next) => {
    console.log('selected meter', req.query.selectedMeter);
    try {
        const allMeterData = await InfoDataItem.fetchAllMeterData();
        res.status(200).json(allMeterData.rows);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 600;
        }
        next(err);
    }
};


exports.getThisMeterData = async(req, res, next) => {
    try {
        //console.log('search parameters', req.query.selectedMeter);

        var parameters = JSON.parse(req.query.selectedMeter);

        const allMeterData = await InfoDataItem.fetchAllThisMeterData(parameters);
        res.status(200).json(allMeterData.rows);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 600;
        }
        next(err);
    }
};

exports.getAllScheduleItems = async(req, res, next) => {
    try {
        const allScheduleItems = await InfoDataItem.fetchAllSchedules();
        // console.log('allschedules', allScheduleItems.rows);
        res.status(200).json(allScheduleItems.rows);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 600;
        }
        next(err);
    }
};


exports.getScheduleFiles = async(req, res, next) => {
    //  console.log('search files parameters', req.query.selectedFiles);
    try {

        const allScheduleItems = await InfoDataItem.fetchScheduleFiles();
        // console.log('allschedules', allScheduleItems.rows);
        res.status(200).json(allScheduleItems.rows);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 600;
        }
        next(err);
    }
};

exports.getNextSchedule = async(req, res, next) => {
    try {
        const allScheduleItems = await InfoDataItem.fetchNextSchedule();
        // console.log('allschedules', allScheduleItems.rows);
        res.status(200).json(allScheduleItems.rows);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 600;
        }
        next(err);
    }
};


exports.getAllFiles = async(req, res, next) => {
    try {
        receivedFiles = [];
        const allFiles = await InfoDataItem.fetchAllFiles();
        console.log('allFiles', allFiles.rows);
        res.status(200).json(allFiles.rows);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 600;
        }
        next(err);
    }
};


exports.getAllNewFiles = async(req, res, next) => {
    var selFiles = [];
    selFiles = req.query.selectedFiles;
    //console.log('search files parameters', selFiles);

    try {
        const allFiles = await InfoDataItem.fetchAllNewFiles(selFiles);
        //console.log('all files ', allFiles);
        res.status(200).json(allFiles);
    } catch (err) {
        console.log('fault', err);
        if (!err.statusCode) {
            err.statusCode = 600;
        }
        next(err);
    }
};


exports.getDeviceTypes = async(req, res, next) => {
    try {
        console.log('getting device types');

        const allDeviceTypes = await InfoDataItem.deviceTypes();

        res.status(200).json(allDeviceTypes.rows);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 600;
        }
        next(err);
    }
};

exports.postInfoDataItem = async(req, res, next) => {

    try {
        const postResponse = await InfoDataItem.post(req.body.item);
        res.status(201).json(postResponse);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.postReport = async(req, res, next) => {
    var mypath = path.join(__dirname, '../reports', req.body[0][0].name);
    try {
        if (!fs.existsSync(mypath)) {
            console.log('req body', req.body[0][0].name);
            fs.mkdir(path.join(__dirname, '../reports', req.body[0][0].name), (err) => {
                if (err) {
                    return console.error(err);
                }
                console.log('Directory created successfully!');
            });
        } else {
            console.log('Directory not created!');
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
    const postResponse = await InfoDataItem.postReport(req);
    res.status(201).json(postResponse);
};

exports.postSchedule = async(req, res, next) => {
    // console.log('controller', req.body);
    try {
        const nextSchedule = await Schedule.fetchNextSchedule(req);
        const postResponse = await InfoDataItem.postSchedules(req);
        res.status(201).json(nextSchedule);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateSchedule = async(req, res, next) => {
    console.log('updating schedule', req.body.name);
    //var newSchedule = Scheduler.scheduleSocketStart(req.body.name);
    try {

        const postResponse = await Schedule.updateSchedule(req);
        res.status(201).json(postResponse);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.putInfoDataItem = async(req, res, next) => {
    try {
        const putResponse = await InfoDataItem.update(req.body.id, req.body.item);
        res.status(200).json(putResponse);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteInfoDataItem = async(req, res, next) => {
    try {
        const deleteResponse = await InfoDataItem.delete(req.params.id);
        console.log('delete', deleteResponse);
        res.status(200).json(deleteResponse);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteSchedule = async(req, res, next) => {
    console.log('delete schedule', req.params.name);
    try {
        const deleteResponse = await InfoDataItem.deleteSchedule(req.params.name);

        console.log('delete', deleteResponse);
        res.status(200).json(deleteResponse);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.deleteReport = async(req, res, next) => {
    console.log('delete report', req.params.name);
    try {
        const deleteResponse = await InfoDataItem.deleteReport(req.params.name);
        console.log('delete', deleteResponse);
        res.status(200).json(deleteResponse);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.downloadFile = async(req, res, next) => {
    console.log('search files parameters', req.query.selectedFiles);
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    var index = req.query.selectedFiles.search("-");
    var dir = req.query.selectedFiles.substr(0, index);
    var newPath = path.join(__dirname, '../reports', dir, req.query.selectedFiles);
    console.log('new path', newPath);

    res.download(newPath, (error) => {
        if (!error) console.log("File downloaded here");
    });
};



exports.getSearchResult = async(req, res, next) => {
    try {
        console.log('search parameters', req.query.selectedDevices);

        var parameters = JSON.parse(req.query.selectedDevices);
        //const allDeviceTypes = await InfoDataItem.deviceTypes();
        const allDeviceTypes = await InfoDataItem.getSearchResult(parameters);

        res.status(200).json(allDeviceTypes.rows);

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 600;
        }
        next(err);
    }
};


exports.getAllMeters = async(req, res, next) => {
    try {
        console.log('search parameters', req.query.selectedMeters);

        var parameters = JSON.parse(req.query.selectedMeters);

        const allMeters = await InfoDataItem.fetchAllMeters(parameters);


        res.status(200).json(allMeters.rows);

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 600;
        }
        next(err);
    }
};