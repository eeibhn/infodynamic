const express = require('express');
const { prependOnceListener } = require('process');
const cors = require("cors");

const InfoDataController = require('../controllers/infodata');
const ScheduleDataController = require('../controllers/scheduler');

const { pool } = require('../util/database');

const router = express.Router();
const path = require('path');
const fs = require('fs');



const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './my_uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage });
//Middelware

router.get('/pdf', InfoDataController.getPDF);

router.get('/test', InfoDataController.getAllInfoDataItems);

router.get('/', InfoDataController.getAllInfoDataItems);

//router.get('/scheduleDataItems', ScheduleDataController.scheduleStart);

router.get('/nem', InfoDataController.getAllNEMItems);

router.get('/area', InfoDataController.getAllAreaItems);

router.get('/files', InfoDataController.getAllNewFiles);

router.get('/viewFile', InfoDataController.downloadFile);

router.get('/schedule', InfoDataController.getAllScheduleItems);

router.get('/schedule', ScheduleDataController.getNextScheduleItem);

router.get('/deviceTypes', InfoDataController.getDeviceTypes);

router.get('/meter', InfoDataController.getAllMeters);

router.get('/getSearchResult', InfoDataController.getSearchResult);

router.get('/getMeterData', InfoDataController.getMeterData);

router.get('/getScheduleFiles', InfoDataController.getScheduleFiles);

router.get('/meterData', InfoDataController.getThisMeterData);


//router.post('/', InfoDataController.postInfoDataItem);

router.put('/', InfoDataController.putInfoDataItem);

//router.delete('/:id', InfoDataController.deleteInfoDataItem);

router.delete('/:name', InfoDataController.deleteSchedule);

router.delete('/deleteReport/:name', InfoDataController.deleteReport);


router.get('/api/download', InfoDataController.downloadFile);



//router.post('/api/upload', InfoDataController.uploadFile);

/*
router.post('/upload', upload.single("file"), (req, res, next) => {
    try {
        var index = req.file.filename.search("-");
        console.log('file uploading in router', index);
        var filename = req.file.filename.substr(0, index);
        console.log('file name uploading in router', filename);

        const file = req.file;

        res.send({
            success: true,
            message: " File Uploaded",
            data: { path, filename },
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}); */
var upload = multer({
    storage: storage
}).single('file');

router.post('/uploadb', upload, (req, res, next) => {
    console.log('trying to upload');
    var index = req.file.filename.search("-");
    var dir = req.file.filename.substr(0, index);

    //console.log('req.body', req.file.filename.search("-"), dir, req.file.filename);
    var oldPath = path.join(__dirname, '../my_uploads', req.file.filename);
    var newPath = path.join(__dirname, '../reports', dir, req.file.filename);
    //console.log('old path', oldPath, newPath);
    fs.rename(oldPath, newPath, function(err) {
        if (err) throw err
        console.log('Successfully renamed - AKA moved!', req.file.filename)
    });

    return res.send({ message: "File uploaded successfully." });
    /*fs.move('../my_uploads / ' + req.file.filename, '.. / schedules / ' + dir + ' / ' + fileName, function(err) {
    if (err) {
        return console.error(err);
    }
    res.json({});
    }); */
});








router.post('/updateSchedule', InfoDataController.updateSchedule);

router.post('/postSchedule', InfoDataController.postSchedule);

router.post('/postReport', InfoDataController.postReport);

module.exports = router;
