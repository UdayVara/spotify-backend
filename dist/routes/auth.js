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
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "SPOTIFYCLONESECRET";
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const findUser = yield User.findOne({ email: email });
        if (findUser) {
            res.send({ success: false, message: "Email Already Exists." });
        }
        else {
            const hashedPassword = bcrypt.hashSync(password, salt);
            const newUser = yield User.create({
                username: username,
                email: email,
                password: hashedPassword,
            });
            if (newUser) {
                const token = jwt.sign({ id: newUser._id }, JWT_SECRET);
                res.send({ success: true, message: "Signed up successfully", token });
            }
            else {
                res.send({ success: false, message: "Internal Server Error." });
            }
        }
    }
    catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: "Internal Server Error.",
            error: error,
        });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const findUser = yield User.findOne({ email: email });
        if (findUser) {
            if (bcrypt.compareSync(password, findUser.password)) {
                const token = jwt.sign({ id: findUser._id }, JWT_SECRET);
                res.send({ success: true, message: "Login Successfully", token });
            }
            else {
                res.send({ success: false, message: "Invalid Password" });
            }
        }
        else {
            res.send({ success: false, message: "Invalid Email" });
        }
    }
    catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: "Internal Server Error.",
            error: error,
        });
    }
}));
module.exports = router;
