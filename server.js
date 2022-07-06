const express = require("express");
const mongoose = require("mongoose");
const env = require("dotenv").config();
const cors = require("cors");
const path = require("path");

const app = express();

const initMongo = () => {
  try {
    console.log("\x1b[32m", "Enter initMongo()\t\t[OK]");
    mongoose.connect("mongodb://localhost:27017/bank-app");
  } catch (e) {
    console.log("\x1b[31m", "Enter initMongo\t\t[Err]");
    console.log("\x1b[0m", "\t> " + e.toString());
  }
};

const port = process.env.PORT || process.env.APP_PORT;

const initExpress = () => {
  try {
    console.log("\x1b[32m", "Enter initExpress()\t\t[OK]");
    app.use(cors({ origin: true }));

    console.log("\x1b[32m", "Enter initRoutes \t\t[OK]");
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(express.static(path.join(__dirname, "./public/")));
    app.use(require("./src/routes.js"));

    app.listen(port, () => {
      console.log(
        "\x1b[33m",
        `Server listening on port ${process.env.APP_PORT}`
      );
    });
  } catch (e) {
    console.log("\x1b[31m", "Enter initExpress\t\t[Err]");
    console.log("\x1b[0m", "\t> " + e.toString());
  }
};

const main = () => {
  initExpress();
  initMongo();
};
main();
