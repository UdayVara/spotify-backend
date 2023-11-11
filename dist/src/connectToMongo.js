"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const connectToMongo = () => {
    mongoose
        .connect("mongodb+srv://uday:uday4268@cluster0.ov7y3cz.mongodb.net/spotify")
        .then(() => {
        console.log("Connection Established");
    })
        .catch((err) => {
        console.log("failed due to " + err);
    });
};
module.exports = connectToMongo;
