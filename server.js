var createError = require('http-errors');
var express = require('express');
var path = require('path');



var {router: notesRouter} = require('./routes/notes');
var {router: signupRouter} = require('./routes/signup');
var {router: signinRouter} = require('./routes/signin');

var app = express();



// Parsing
app.use(express.json())
app.use('/notes', notesRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);



module.exports = app;

var port = process.env.PORT || 3000;


app.listen(port, function () {
    console.log('Example app listening on port ', port)
})
