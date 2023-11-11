import { timeStamp } from "console";
import mongoose, { Schema,model } from "mongoose";

type song = {
   name:string,
   singer:string,
   image:string,
   song:string,
   uploadedBy:mongoose.Schema.Types.ObjectId
}

const songSchema = new Schema<song>({
    name:{type:String,required:true},
    singer:{type:String,required:true},
    image:{type:String,required:true},
    song:{type:String,required:true},
    uploadedBy:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"User"},
},{timestamps:true})


const Song =  model<song>("Song",songSchema)

module.exports = Song

