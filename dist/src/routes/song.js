"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const Song = require("../models/song");
const User = require("../models/User");
const validateUser = require("../middleware/validateUser");
router.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
router.post("/upload", validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.files.image);
    // console.log(req.files.song);
    try {
        const image = yield cloudinary_1.v2.uploader.upload(req.files.image.tempFilePath, { resource_type: "image", folder: "spotify-clone" });
        const song = yield cloudinary_1.v2.uploader.upload(req.files.song.tempFilePath, {
            resource_type: "video",
            folder: "spotify-clone",
        });
        const newSong = yield Song.create({
            name: req.body.name,
            singer: req.body.singer,
            image: image.secure_url,
            song: song.secure_url,
            uploadedBy: req.user.id,
        });
        if (newSong) {
            res.send({ success: true, message: "New Song uploaded Successfully." });
        }
        else {
            res.send({ sucess: false, message: "Internal Server Error." });
        }
    }
    catch (error) {
        console.log(error);
        res.send({ success: false, message: "Internal Server Error", error });
    }
}));
router.get("/getall", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const songs = yield Song.find({}).sort({ createdAt: -1 });
        if (songs) {
            res.send({
                success: true,
                message: "Songs Fetched Successfully.",
                songs,
            });
        }
        else {
            res.send({ success: false, message: "Internal Server Error." });
        }
    }
    catch (error) {
        console.log(error);
        res.send({ success: false, message: "Internal Server Error." });
    }
}));
router.get("/getmy", validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const songs = yield Song.find({ uploadedBy: req.user.id });
        if (songs) {
            res.send({ success: true, message: "Songs Fetched", songs });
        }
        else {
            res.send({ success: false, message: "Internal Serve Error." });
        }
    }
    catch (error) {
        console.log(error);
        res.send({ success: false, message: "Internal Server Error." });
    }
}));
router.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const songs = yield Song.find({
            name: { $regex: req.query.song, $options: "i" },
        });
        if (songs) {
            res.send({ success: true, message: "Match Found", songs });
        }
        else {
            res.send({ success: false, message: "Internal Server Error." });
        }
    }
    catch (error) {
        res.send({ success: false, message: "Internal Server Error." });
    }
}));
router.get("/getbyid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const song = yield Song.findOne({
            _id: id,
        });
        if (song) {
            res.send({ success: true, message: "Song Found", song });
        }
        else {
            res.send({ success: false, message: "Invalid ID" });
        }
    }
    catch (error) {
        console.log(error);
        res.send({ success: false, message: "Internal Server Error." });
    }
}));
router.get("/handlelike", validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findOne({ _id: req.user.id });
        if (user.favSong.length != 0) {
            if (user.favSong.includes(req.query.songId)) {
                let temp = user.favSong;
                let filteredArray = temp.filter((element, index) => {
                    if (element == req.query.songId) {
                        temp.slice(index, 1);
                    }
                });
                user.favSong = filteredArray;
                yield user.save();
                res.send({ success: true, message: "Like removed" });
            }
            else {
                let temp = user.favSong;
                temp.push(req.query.songId);
                user.favSong = temp;
                yield user.save();
                res.send({ success: true, message: "Like Added" });
            }
        }
        else {
            console.log("not exists");
            const temp = [req.query.songId];
            user.favSong = temp;
            yield user.save();
            res.send({ success: true, message: "Song added", user });
        }
    }
    catch (error) {
        console.log(error);
        res.send({ success: false, message: "Internal Server Error." });
    }
}));
router.get("/likedSongs", validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findOne({ _id: req.user.id });
        if (user) {
            res.send({ success: true, message: "user found", liked: user.favSong });
        }
        else {
            res.send({ success: false, message: "user not found" });
        }
    }
    catch (error) {
        console.log("internal server Error");
        res.send({ success: false, message: "internal Server Error" });
    }
}));
module.exports = router;
