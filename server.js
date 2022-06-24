const express = require("express");
const mongoose = require("mongoose");
const routes = require("./src/routes.js");
const env = require("dotenv").config();

const app = express();

app.use(routes);

app.listen(process.env.APP_PORT, () => {
  console.log(`Server listening on port ${process.env.APP_PORT}`);
});
