const express=require('express');
const router=express.Router();
const Comment=require("../models/Comment")
const {body,validationResult}=require('express-validator');
const fetchUser = require('../middleware/fetchUser');
const req = require('express/lib/request');

router.post('/post',fetchUser,[
    body('content',"cannot be empty").exists(),
],(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()})
    }
    try {
        let user=Comment.create({
            th_id:req.body.id,
            content:req.body.content,
            comment_by:req.user.id
        });
        if(user)
        {
            res.json({"success":"true","result":"Comment Posted"})
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});
router.delete('/delete',fetchUser,async(req,res)=>{
    try {
        let id=req.body.id;
        let del=await Comment.findById(id);
        del=await Comment.findByIdAndDelete(id);
        if(del)
        {
            res.json({"success":"true","result":"Comment Deleted."});
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})
module.exports=router;