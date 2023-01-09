const mongoose=require("mongoose");
const { Schema }=mongoose;
const CategorySchema=new Schema({
    name: {
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true,
    },
    date: {
        type:Date,
        default:Date.now
    }
})
const Category=mongoose.model('category',CategorySchema);
// Category.createIndexes();
module.exports=Category;