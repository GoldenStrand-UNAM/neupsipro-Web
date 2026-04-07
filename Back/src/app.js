require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

const forumRoutes = require("./presentation/routes/forumRoutes");

app.use("/forum", forumRoutes());

module.exports = app;