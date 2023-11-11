import { Request,Response,Application } from "express";
const express = require("express");
const app:Application = express();
const port = 5000;
const cors = require("cors")
const connectToMongo = require("../src/connectToMongo")
require("dotenv").config()
app.use(express.json())
app.use(cors())
connectToMongo();
app.get("/", (req: Request, res:Response) => {
  res.send("Hello World!");
}); 
app.use("/auth",require("./routes/auth"))
app.use("/song",require("./routes/song"))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export {}
