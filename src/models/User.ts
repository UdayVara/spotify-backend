import mongoose, { Schema, model, connect } from 'mongoose';


type user = {
    username:string,
    email:string,
    password:string,
    favSong:[]
}

const userSchema = new Schema<user>({
    email:{type:String,required:true},
    username:{type:String,required:true},
    password:{type:String,required:true},
    favSong:{type:[{type:mongoose.Schema.Types.ObjectId,ref:"Song",required:true}]}
})


const User = model<user>("User",userSchema)


module.exports =  User


