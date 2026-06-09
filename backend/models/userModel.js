import mongoose from "mongoose";
import Schema from "mongoose/Schema.js";

const UserSchema =  new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    
    },
    repositories:[
        {
            default:[],
            type:Schema.Types.ObjectId,
            ref:"Repository",
        },
    ],
    followedUsers:[
        {
            default:[],
            type:Schema.Types.ObjectId,
            ref:"User",
        },
    ],
    starRepository:[
        {
            default:[],
            type:Schema.Types.ObjectId,
            ref:"Repository",
        },
    ],
});


const User = mongoose.model("User",UserSchema);

export default User;