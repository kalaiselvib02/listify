
require("dotenv").config()
const express = require("express");
const bodyParser = require('body-parser');

let router = require("./routes");
const logger = require("./loggers/loggers");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/"  , router);

app.listen(process.env.PORT , () => logger.info("Server Started"));