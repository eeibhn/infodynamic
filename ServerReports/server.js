const Observer = require('./services/obserser');
const fs = require('fs');
const { pool } = require('../Server/util/database');
const { stringify } = require('@angular/compiler/src/util');


var observer = new Observer();

const folder = '../Server/reports';

var schdeuleDetails = {
    name: '',
    startdate: '',
    enddate: '',
    frequency: 0
}

schdeuleDetailsArray = new Array(schdeuleDetails());


observer.on('file-added', log => {
    // print error message to console
    console.log('once');

    fs.readdir(folder, (err, files) => {
        if (err) {
            throw err;
        }
        console.log('files', files);
        // files object contains all files names
        // log them on console
        files.forEach((file, index) => {
            pool.query('SELECT name, startdate, enddate, frequency  FROM scheduler WHERE name = ($1)', [file], (err, result) => {
                if (err) {
                    return console.error('Error executing query', err.stack)
                }
                schdeuleDetailsArray[index].name = result.rows.name;
                schdeuleDetailsArray[index].startdate = result.rows.startdate;
                schdeuleDetailsArray[index].enddate = result.rows.enddate;
                schdeuleDetailsArray[index].name = result.rows.name;

                console.log('results', result.rows); // brianc
            });
        });
    });
});

observer.watchFolder(folder);