const jwt=require('jsonwebtoken')

module.exports=function(req,res,next){
    try {
        const token=req.header('x-token')
        if(!token){
            return res.status(400).json("without token unable login")
        }
        const decode=jwt.verify(token,"jwt")
        req.user= decode.user
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json("server error middleware")
    }
}