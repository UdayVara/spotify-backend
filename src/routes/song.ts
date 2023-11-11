import { v2 as cloudinary } from "cloudinary";
import { Request, Response } from "express";
const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const Song = require("../models/song");
const User = require("../models/User");
const validateUser = require("../middleware/validateUser");
router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
router.post("/upload", validateUser, async (req: any, res: any) => {
  // console.log(req.files.image);
  // console.log(req.files.song);
  try {
    const image = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      { resource_type: "image", folder: "spotify-clone" }
    );
    const song = await cloudinary.uploader.upload(req.files.song.tempFilePath, {
      resource_type: "video",
      folder: "spotify-clone",
    });

    const newSong = await Song.create({
      name: req.body.name,
      singer: req.body.singer,
      image: image.secure_url,
      song: song.secure_url,
      uploadedBy: req.user.id,
    });

    if (newSong) {
      res.send({ success: true, message: "New Song uploaded Successfully." });
    } else {
      res.send({ sucess: false, message: "Internal Server Error." });
    }
  } catch (error) {
    console.log(error);

    res.send({ success: false, message: "Internal Server Error", error });
  }
});

router.get("/getall", async (req: Request, res: Response) => {
  try {
    const songs = await Song.find({}).sort({ createdAt: -1 });

    if (songs) {
      res.send({
        success: true,
        message: "Songs Fetched Successfully.",
        songs,
      });
    } else {
      res.send({ success: false, message: "Internal Server Error." });
    }
  } catch (error) {
    console.log(error);

    res.send({ success: false, message: "Internal Server Error." });
  }
});

router.get("/getmy", validateUser, async (req: any, res: Response) => {
  try {
    const songs = await Song.find({ uploadedBy: req.user.id });

    if (songs) {
      res.send({ success: true, message: "Songs Fetched", songs });
    } else {
      res.send({ success: false, message: "Internal Serve Error." });
    }
  } catch (error) {
    console.log(error);

    res.send({ success: false, message: "Internal Server Error." });
  }
});

router.get("/search", async (req: Request, res: Response) => {
  try {
    const songs = await Song.find({
      name: { $regex: req.query.song, $options: "i" },
    });

    if (songs) {
      res.send({ success: true, message: "Match Found", songs });
    } else {
      res.send({ success: false, message: "Internal Server Error." });
    }
  } catch (error) {
    res.send({ success: false, message: "Internal Server Error." });
  }
});

router.get("/getbyid", async (req: Request, res: Response) => {
  try {
    const id = req.query.id;

    const song = await Song.findOne({
      _id: id,
    });

    if (song) {
      res.send({ success: true, message: "Song Found", song });
    } else {
      res.send({ success: false, message: "Invalid ID" });
    }
  } catch (error) {
    console.log(error);

    res.send({ success: false, message: "Internal Server Error." });
  }
});

router.get("/handlelike", validateUser, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    if (user.favSong.length != 0) {
      if (user.favSong.includes(req.query.songId)) {
        let temp = user.favSong;
        let filteredArray = temp.filter((element, index) => {
          if (element == req.query.songId) {
            temp.slice(index, 1);
          }
        });

        user.favSong = filteredArray;

        await user.save();

        res.send({ success: true, message: "Like removed" });
      } else {
        let temp = user.favSong;
        temp.push(req.query.songId);
        user.favSong = temp;
        await user.save();
        res.send({ success: true, message: "Like Added" });
      }
    } else {
      console.log("not exists");

      const temp = [req.query.songId];
      user.favSong = temp;
      await user.save();
      res.send({ success: true, message: "Song added", user });
    }
  } catch (error) {
    console.log(error);
    
    res.send({success:false,message:"Internal Server Error."})
  }
});

router.get("/likedSongs",validateUser,async(req,res)=>{
  try {
    
 
  const user = await User.findOne({_id:req.user.id})

  if (user) {
    res.send({success:true,message:"user found",liked:user.favSong})
  } else {
    res.send({success:false,message:"user not found"})
  }
} catch (error) {
    console.log("internal server Error");
    res.send({success:false,message:"internal Server Error"})
}
})
module.exports = router;
