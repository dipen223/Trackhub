import mongoose from "mongoose"
import Schema from "mongoose/Schema";


const RepoSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
        type:String,
    },
    content:[{
        type:String,
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    visibility:{
        type:Boolean,
        default:false,
    },
    issues:[{
        type:Schema.Types.ObjectId,
        ref:"Issue",
    }],
});

const Repository = mongoose.model("Repository",RepoSchema);
export default Repository;