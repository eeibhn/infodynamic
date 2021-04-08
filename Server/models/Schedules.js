const { Console } = require('console');
let { pool: pool } = require('../util/database');
const express = require('express');
const multer = require('multer');
var squel = require("squel");
const fs = require('fs');
const path = require('path');
const { FSWatcher } = require('chokidar');
const { forEach } = require('lodash');
const folder = './';
var moment = require('moment'); // require
const schedule = require('node-schedule');
const { SlowBuffer } = require('buffer');



module.exports = class Schedule {
    constructor(id, item) {
        this.id = id;
        this.item = item;

    }


    static fetchAllSchedules() {
        //   const myquery = 'SELECT * FROM nmidatadetails200 a WHERE a.nmi = \'3036493791\' LIMIT 5 ';
        //console.log('me');

        return pool.query('SELECT name, startdate, enddate, frequency FROM scheduler');
    }

    static fetchScheduleData(req) {
        console.log('req in schedules fetching', req);
        // const myquery1 = pool.query('select * from areaschedule a inner join meterschedule b on a.areaid = b.areaid right join meterdatachart1 c on c.meterserialno = b.meterserialno');
        return pool.query('select * from meterschedule a where a.schedulename =($1)', [req]);
    }




    static updateSchedule(item) {
        const data = item.body;
        // console.log('update scheduledata', data);
        var s = squel.update()
            .table("scheduler")
            .where("name = ?", data.name)
            .set("name", data.name)
            .set("endscheduledate", data.endscheduledate)
            .set("startscheduledate", data.startscheduledate)
            .set("frequency", data.frequency);

        return pool.query(s.toString());
    }


    static fetchNextSchedule(item) {
        // Function to get current filenames
        // in directory

        //let startTime = moment(item.body.startscheduledate).valueOf();
        //let endTime = moment(item.body.endscheduledate).valueOf();
        console.log('end time', endTime)

        //const myrule = new schedule.RecurrenceRule();
        const myrule = '*/' + frequency + ' * * * * * ';

        const startTime = new Date(Date.now() + 1000);
        const nextTime = new Date(Date.now() + item.body.frequency * 1000);
        console.log('times', startTime, nextTime);

        const endTime = new Date(startTime.getTime() + 5000);

        const job = schedule.scheduleJob({ start: startTime, end: endTime, rule: myrule }, function() {
            console.log('Time for tea!');
            let nextReportTime = pool.query('UPDATE scheduler SET nextreport = ($1) WHERE name = ($2)', [nextTime + frequency, item.body.name]);
            let scheduleDetails = pool.query('SELECT name, startdate, enddate, frequency FROM scheduler');

            return scheduleDetails;
        });



    }

};