const express = require('express');
const parser = require('body-parser');

// create connection to database
require('./handlers/dataConnector.js').connect();
// create an express app
const app = express();

let port = 8080;
app.listen(port, function () {
    console.log("Server running at port= " + port);
});