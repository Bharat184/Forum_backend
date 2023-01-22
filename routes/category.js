const express=require('express');
const router=express.Router();
const Category=require("../models/Category")
const {body,validationResult}=require('express-validator');

router.post('/add',[
    body('name','name cannot be empty').exists(),
    body('description','description cannot be empty').exists()
],async (req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty())
    {
        return res.status(400).json({error:error.array()});
    }
    try {
        let category=await Category.findOne({name:req.body.name})
        if(category)
        {
        res.send("Name already exists")
        }
        else
       {
        category=await Category.create({
            "name":req.body.name,
            "description":req.body.description
        })
        if(category)
        {
            res.json({"success":"true"})
        }
      }
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error");
    }
    
})
router.get('/fetchCat',async (req,res)=>{
    let category=await Category.find();
    res.json(category)
});

module.exports=router;