const express=require('express');
const router=express.Router();
const User=require("../models/User")
const {body,validationResult}=require('express-validator')
const jwt=require('jsonwebtoken');
const bcrypt = require('bcryptjs/dist/bcrypt');
const JWT_Secret="murof";
const fetchUser=require('../middleware/fetchUser')

router.post('/verify',(req,res)=>{
    let authTok=req.body.authtoken;
    const data=jwt.verify(authTok,JWT_Secret);
    let id=data.user.id;
    User.countDocuments({"_id":id}, function(err, c) {
    res.json({"count":c})
    });
});

router.post('/createuser',[
    body('name','Name should be of minimum 3 characters').isLength({min:3}),
    body('email',"Enter a valid email").isEmail(),
    body('password',"Password minimum character should be 8").isLength({min:8}),
],async (req,res)=>{

        const errors=validationResult(req);
        const salt=await bcrypt.genSalt(10);
        const secPass=await bcrypt.hash(req.body.password,salt);
        if(!errors.isEmpty())
        {
            return res.status(400).json({ success:false,status:errors.array()[0].msg});
        }
        try {
            let user = await User.findOne({email:req.body.email});
            let username= await User.findOne({name:req.body.name})
            console.log(user,username)
            if(user)
            {
                return res.status(400).json({success:false,status:"Email already exists."});
            }
            else if(username)
            {
                return res.status(400).json({success:false,status:"Username already exists."});
            }
           else
           {
            user=await User.create(
                {
                    name:req.body.name,
                    email:req.body.email,
                    password:secPass,
               }
            );
            const data={
                user: {
                    id:user.id
                }
            }
            const authToken=jwt.sign(data,JWT_Secret);
            if(user)
            {
                return res.json({"success":"true","result":"Successfully Registered",authToken:authToken});
            }
           }
          } catch (error) {
            console.log("SERVER")
              return res.status(500).send("Internal server Error");
          }    
})

router.post('/login',[
    body('email',"Invalid Email").isEmail(),
    body('password',"Enter Password").isLength({min:1}),
],async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()})
    }
    const {email,password}=req.body;
    try {
        let user=await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({error:"Invalid Credentials"});

        }
        const passCompare=await bcrypt.compare(password,user.password);
        if(!passCompare)
        {
            return res.status(400).json({error:"Invalid Credentials"});
        }
        const data={
            user: {
                id:user.id
            }
        }
        const authToken=jwt.sign(data,JWT_Secret);
        return res.json({"Success":"true",
        "authToken":authToken});
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});

router.post('/getuser',fetchUser, async (req,res)=>{
    try {
        const  userId=req.user.id;
        const user=await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
}
);
router.get('/getusers',fetchUser,async(req,res)=>{
    try {
        const user=await User.find().select("-password");
        res.send(user)

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

module.exports=router;