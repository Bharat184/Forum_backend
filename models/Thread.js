const mongoose=require("mongoose");
const {Schema}=mongoose;
const threadSchema=new Schema({
    cat_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category'
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title: {
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('thread',threadSchema);