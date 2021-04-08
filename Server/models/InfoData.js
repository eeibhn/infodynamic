const { Console } = require('console');
let { pool: pool } = require('../util/database');
const express = require('express');
const multer = require('multer');
var squel = require("squel");
const fs = require('fs');
const path = require('path');
const { FSWatcher } = require('chokidar');
const { CONSOLE_APPENDER } = require('karma/lib/constants');
const folder = './';

module.exports = class InfoData {
    constructor(id, item) {
        this.id = id;
        this.item = item;


        const storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, '../my-uploads')
            },
            filename: function(req, file, cb) {
                cb(null, file.originalname)
            }
        })

        var upload = multer({ storage: storage });

    }

    static fetchAll() {
        return pool.query('SELECT * FROM Roames LIMIT 5');
    }

    static fetchAllNEM() {
        //   const myquery = 'SELECT * FROM nmidatadetails200 a WHERE a.nmi = \'3036493791\' LIMIT 5 ';
        const myquery = 'SELECT * FROM nmidatadetails200';
        return pool.query(myquery);
    }


    static fetchAllSchedules() {
        //   const myquery = 'SELECT * FROM nmidatadetails200 a WHERE a.nmi = \'3036493791\' LIMIT 5 ';
        console.log('me');

        const myquery = 'SELECT * FROM scheduler';

        return pool.query(myquery);
    }

    static fetchThisSchedule(thisname) {
        //   const myquery = 'SELECT * FROM nmidatadetails200 a WHERE a.nmi = \'3036493791\' LIMIT 5 ';
        // console.log('me');

        return pool.query('SELECT * FROM scheduler where name=($1)', [thisname]);
    }

    static fetchAllFiles() {
        // Function to get current filenames
        // in directory
        console.log('all files');
        return pool.query('SELECT name, datecreated, startdate, devicetype, frequency FROM files');

    }

    static fetchScheduleFiles() {
        // Function to get current filenames
        // in directory
        console.log('all files');
        return pool.query('SELECT name, datecreated, startdate, devicetype, frequency FROM files');

    }

    static fetchAllArea() {
        // Function to get current filenames
        // in directory
        console.log('area');
        return pool.query('SELECT areaid,name FROM areas');

    }


    static fetchNextSchedule() {
        // Function to get current filenames
        // in directory
        console.log('fetch next schedule');
        // return pool.query('SELECT EXTRACT(EPOCH FROM(SELECT min(startdate) FROM scheduler))');
        return pool.query('SELECT startdate, enddate, frequency FROM scheduler');
    }

    static fetchAllNewFiles(inputFolders) {
        console.log('inputfolders', inputFolders);
        var unfilteredFolders = JSON.parse(inputFolders);
        var folders = unfilteredFolders.filter(function(value, index, arr) {
            return value !== -1;
        });
        // console.log('finally', folders);

        try {
            var allFiles = [];
            // console.log('files', folders);
            folders.forEach(directory => {

                //  console.log('dir', path.join('./schedules', directory));
                var thisdirectory = path.join('./reports', directory);
                var files = fs.readdirSync(thisdirectory);
                files.forEach(thisFile => {
                    try {
                        var myFile = path.join(thisdirectory, thisFile);
                        //console.log('file in directory', myFile);

                        var stats = fs.statSync(myFile);
                        //  console.log('stats', stats);

                        var object1 = new Object();
                        object1.name = thisFile;
                        object1.datecreated = stats.birthtime;
                        object1.directory = directory;
                        allFiles.push(object1);
                    } catch (err) {
                        console.log('not a file');
                    }
                })

            });
        } catch (err) {
            console.log(err);
        }
        // console.log('this file', allFiles);
        return allFiles;

    }


    static deviceTypes() {
        //  return pool.query('SELECT a.meterserialnumber FROM nmidatadetails200 a LIMIT 5');
        return pool.query('SELECT a.meterserialnumber FROM nmidatadetails200');
    }



    static fetchAllMeterData() {
        //   const myquery = 'SELECT * FROM nmidatadetails200 a WHERE a.nmi = \'3036493791\' LIMIT 5 ';
        console.log('fetching meter data ');
        return pool.query('SELECT d.intervaldatavalue FROM nmidatadetails200 b INNER JOIN intervaldata300 c ON b.key200 = c.parentrowid INNER JOIN intervaldatavalues300 d on c.key300 = d.parentrowid LIMIT 200');
        //return pool.query('SELECT b.nmi, b.intervallength, c.intervaldate, d.intervaldatavalue FROM nmidatadetails200 b INNER JOIN intervaldata300 c ON b.key200 = c.parentrowid INNER JOIN intervaldatavalues300 d on c.key300 = d.parentrowid LIMIT 100');
    }

    static fetchAllThisMeterData(meterno) {
        //   const myquery = 'SELECT * FROM nmidatadetails200 a WHERE a.nmi = \'3036493791\' LIMIT 5 ';
        console.log('fetch this meter data', meterno);
        return pool.query('SELECT b.nmi, b.intervallength, c.intervaldate, d.intervaldatavalue FROM nmidatadetails200 b INNER JOIN intervaldata300 c ON b.key200 = c.parentrowid INNER JOIN intervaldatavalues300 d on c.key300 = d.parentrowid where b.nmi=($1) limit 200', [meterno]);
    }

    static fetchAllMeters(parameters) {
        console.log("parameters for areas", [parameters[0]]);
        const allMeters = [];

        return pool.query('SELECT a.nmi, a.meterserialnumber, a.intervallength, a.areaid FROM public.nmidatadetails200 a WHERE a.areaid in ($1,$2,$3)', [parameters[0], parameters[1], parameters[2]]);
    }

    static getSearchResult(parameters) {

        console.log('SQL command', parameters[3], parameters[4]);

        const device = BigInt(parameters[1]);
        const startdevice = BigInt(parameters[1]);
        const enddevice = BigInt(parameters[2]);

        var s = squel.select();
        s.from("nemfiles100");
        s.where("nemfiles100.datetime BETWEEN ? AND ?", parameters[3], parameters[4]), s.from("nmidatadetails200").where("nmidatadetails200.meterserialnumber BETWEEN ? AND ?", parameters[1], parameters[2]);

        return pool.query(s.toString());

    }

    static post(item) {
        return pool.query('INSERT INTO nemfiles100 (filename) VALUES ($1)', [2],
            function(err, result, fields) {
                console.log(result);
            });
    }

    static postReport(item) {
        //console.log('post report from search', item.body[0][0]);
        const data = item.body[0][0]; //schedule data
        const areaData = item.body[0][1];
        const meterData = item.body[0][2];
        const chart1Data = item.body[1];
        const chart2Data = item.body[2];
        let chart1DataRounded = [];
        let chart2DataRounded = [];
        console.log('meter data post report', meterData);

        for (var ind = 0; ind < chart1Data.length; ind++) {
            console.log('item body post report chart ind', ind, meterData[ind].meterserialnumber);
        }

        chart1Data.forEach((array, index) => {
            const element = array.map(function(each_element) {
                return Number(each_element).toFixed(6);
            });
            chart1DataRounded[index] = element;
        });


        chart2Data.forEach((array, index) => {
            const element = array.map(function(each_element) {
                return Number(each_element).toFixed(6);
            });
            chart2DataRounded[index] = element;
        });



        chart1Data.forEach((element, i) => {

            console.log('item body post report chart 1', i, meterData[i].meterserialnumber, element);
            //   console.log('item body post report chart 2', chart2DataRounded);
        })



        areaData.forEach(element => {
            if (element !== -1) {
                // console.log('name', element.name);
                pool.query('INSERT INTO areaschedule (areaid, areaname, schedulename) VALUES ($1, $2, $3)', [element.areaid, element.name, data.name],
                    function(err, result, fields) {
                        console.log(result);
                    });
            }

        });


        meterData.forEach((element, index) => {
            if (element !== -1) {
                console.log('meter data name', index, data.name, element.meterserialnumber, chart1DataRounded[index]);
                pool.query('INSERT INTO meterschedule (nmi, meterserialno, interval, areaid,chart1data,chart2data,schedulename) VALUES ($1, $2, $3, $4, $5,$6,$7)', [parseInt(element.nmi), parseInt(element.meterserialnumber), element.intervallength, element.areaid, chart1DataRounded[index], chart2DataRounded[index], data.name],

                    function(err, result, fields) {
                        console.log(result);
                    });
            }
        })

        return pool.query('INSERT INTO scheduler (devicetype, startdevice, enddevice, startdate, enddate, startscheduledate, endscheduledate, name) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [data.selectedDeviceType[0], data.startdevice, data.endDeviceValue, data.startTime, data.endTime, data.startscheduledate, data.endscheduledate, data.name],
            function(err, result, fields) {
                console.log(result);
            });

    }

    static postSchedules(item) {
        const data = item.body;
        console.log('post schedule data', data);
        return pool.query('INSERT INTO scheduler (scheduleid, devicetype, name, startdevice, enddevice, startdate, enddate, frequency) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', [data.scheduleId, data.deviceType[0], data.name, data.startdevice, data.endDevice, data.startdate, data.enddate, data.frequency],
            function(err, result, fields) {
                console.log(result);
            });
    }


    static updateSchedule(item) {
        const data = item.body;
        console.log('update schedule data', data);

        var s = squel.update()
            .table("scheduler")
            .where("name = ?", data.name)
            .set("name", data.name)
            .set("endscheduledate", data.endscheduledate)
            .set("startscheduledate", data.startscheduledate)
            .set("frequency", data.frequency);

        return pool.query(s.toString());
    }

    static deleteSchedule(name) {
        console.log('Deleting schedule', name);
        pool.query('DELETE FROM areaschedule WHERE schedulename = ($1)', [name],
            function(err, result, fields) {
                console.log(result);
            })
        pool.query('DELETE FROM meterschedule WHERE schedulename = ($1)', [name],
            function(err, result, fields) {
                console.log(result);
            })
        return pool.query('DELETE FROM scheduler WHERE name = ($1)', [name],
            function(err, result, fields) {
                console.log(result);
            });
    }


    static deleteReport(name) {
        var index = name.search("-");
        var dir = name.substr(0, index);
        var newPath = path.join(__dirname, '../reports', dir, name);
        try {
            fs.unlinkSync(newPath)
            console.log("Successfully deleted the file.")
        } catch (err) {
            throw err
        }
    }

    static download() {

        res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

        return res.download("data.txt", (error) => {
            if (!error) console.log("File downloaded");
        });
    }

    static upload(filename) {
        console.log('uploading', filename);
        res.send({
            success: true,
            message: " File Uploaded",
            data: { filename },
        });
    }

};