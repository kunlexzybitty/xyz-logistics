var express = require('express');
var timeout = require('express-timeout-handler');
var bodyParser = require('body-parser');
require('dotenv').config();
require('./models/DBManager');
var app = express();


var options = {

    // Optional. This will be the default timeout for all endpoints. (milliseconds)
    timeout: 30000,

    // Optional. This function will be called on a timeout and it MUST
    // terminate the request.
    // If omitted the module will end the request with a default 503 error.
    onTimeout: function(req, res) {
        res.status(408).send();
    },

    // Optional. Provide a list of which methods should be disabled on the
    // response object when a timeout happens and an error has been sent. If
    // omitted, a default list of all methods that tries to send a response
    // will be disable on the response object
    disable: ['write', 'setHeaders', 'send', 'json', 'end']
};

//Add timeout configuration to express server
app.use(timeout.handler(options));

// parse requests of content-type: application/json
app.use(bodyParser.json());

//Default route
app.get('/', function (req, res) {
    res.send({});
});

//Add route files
require ("./routes/Delivery")(app);

//Route not found
app.use(function(req, res){
    res.status(404).send({Status:"ERR_404",Message:"Resource not found"});
});


var server = app.listen(process.env.NODE_PORT || 8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Server listening at http://%s:%s", host, port)
});


module.exports = server;