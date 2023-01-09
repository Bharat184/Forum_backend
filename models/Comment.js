const mongoose=require("mongoose");
const {Schema}=mongoose;
const commentSchema=new Schema({
    th_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'thread'
    },
    content: {
        type:String,
        required:true
    },
    comment_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('comment',commentSchema);