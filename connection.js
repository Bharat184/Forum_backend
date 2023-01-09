const mongoose=require('mongoose')
// const mongoURI="mongodb://localhost:27017/forum";
const mongoURI=`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@atlascluster.cotc7xk.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const connectToMongo=()=>{
    mongoose.connect(mongoURI,(err)=>{
        if(err)
        {
            console.log("ERROR CONNECTING TO DB");
        }
        else
        {
            console.log("connected to mongo db successfully");

        }
    })
}
module.exports=connectToMongo;