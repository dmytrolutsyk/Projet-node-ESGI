const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://root:root@cluster0-0vedk.mongodb.net/test?retryWrites=true&w=majority";
const PORT = process.env.PORT || 3000;
const dbName = process.env.DBNAME || 'notes-api';

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


function dateNow(){
    var dateNow = new Date();
    var day = dateNow.getDate();
    var month = dateNow.getMonth();
    var year = dateNow.getFullYear();
    var hour = dateNow.getHours();
    var minutes = dateNow.getMinutes();
    var seconds = dateNow.getSeconds();
    month += 1;
    const dateFormatted = formatDigits(day) + '/' + formatDigits(month) + '/' + year + ' ' + formatDigits(hour) + ':' + formatDigits(minutes) + ':' + formatDigits(seconds);
    return dateFormatted;
}

function formatDigits(number){
    if(number < 10) {
        number = ('0' + number);
    }
    return number;
}

module.exports = {
    ObjectId,
    MongoClient,
    MONGODB_URI,
    dbName,
    PORT,
    dateNow
};