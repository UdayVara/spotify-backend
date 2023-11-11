"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const connectToMongo = require("../src/connectToMongo");
require("dotenv").config();
app.use(express.json());
app.use(cors());
connectToMongo();
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/auth", require("./routes/auth"));
app.use("/song", require("./routes/song"));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
