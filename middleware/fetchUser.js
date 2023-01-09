const jwt=require('jsonwebtoken');
const JWT_Secret="murof";


const fetchUser=(req,res,next)=>{
    
    
    const token=req.header('auth-token');
    if(!token)
    {
        return res.status(401).send({error:"please authenticate using a valid token"});
    }
    try {
        const data=jwt.verify(token,JWT_Secret);
        req.user=data.user;
        next();
    } catch (error) {
        // console.log(error.message);
        return res.status(401).send({error:"Internal Server Error."});
    }

    
}

module.exports=fetchUser;