import { Request, Response, Router } from "express";

const express = require("express");
const router: Router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "SPOTIFYCLONESECRET";

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const findUser = await User.findOne({ email: email });

    if (findUser) {
      res.send({ success: false, message: "Email Already Exists." });
    } else {
      const hashedPassword = bcrypt.hashSync(password, salt);
      const newUser = await User.create({
        username: username,
        email: email,
        password: hashedPassword,
      });

      if (newUser) {
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET);
        res.send({ success: true, message: "Signed up successfully", token });
      } else {
        res.send({ success: false, message: "Internal Server Error." });
      }
    }
  } catch (error) {
    console.log(error);

    res.send({
      success: false,
      message: "Internal Server Error.",
      error: error,
    });
  }
});


router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const findUser = await User.findOne({ email: email });

    if (findUser) {
      if (bcrypt.compareSync(password, findUser.password)) {
        const token = jwt.sign({ id: findUser._id }, JWT_SECRET);
        res.send({ success: true, message: "Login Successfully", token });
      } else {
        res.send({ success: false, message: "Invalid Password" });
      }
    } else {
      res.send({ success: false, message: "Invalid Email" });
    }
  } catch (error) {
    console.log(error);

    res.send({
      success: false,
      message: "Internal Server Error.",
      error: error,
    });
  }
});

module.exports = router;
