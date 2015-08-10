var express = require('express');

var app = express();

require('./config/middleware.js')(app, express);

module.exports = app;

app.listen(8080);

var port = 8080;
var ip = "127.0.0.1";
console.log("Listening on http://" + ip + ":" + port);