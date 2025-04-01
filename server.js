const express=require('express')
const usermodel=require('./Model/Usermodel.js')
const jwt= require('jsonwebtoken')
const cors=require('cors')
const mongoose=require('mongoose')
const middleware=require('./middleware.js')

mongoose.connect('mongodb+srv://webdevelopment865:9V16Xxu0bpPoJjQX@cluster0.wfqxcss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(()=>{
console.log('db connected');

})
const app=express()
app.use(express.json())
app.use(cors({
    origin:"*"
}))

app.get('/',async(req,res)=>{
    try {
        return res.json("server error")
    } catch (error) {
        console.log(error);
        return res.json("server error")
    }
})

app.post("/reg",async(req,res)=>{
    const {username,email,password,confirmpassword}=req.body;
    try {
        const exist = await usermodel.findOne({email});
        if(!username || !email || !password || !confirmpassword){
            return res.status(400).json("pls fill form perfectly")
        }
        if(exist){
            return res.status(400).json("email alredy exist")
        }
        if(password!==confirmpassword){
            return res.status(400).json("password and confirmpassword not same")
        }
        const newdata= new usermodel({
            username,
            email,
            password,
            confirmpassword,
        })
        await newdata.save()
        return res.status(200).json("signup")
    } catch (error) {
        console.log(error);
        return res.status(500).json("server error")
    }
})

app.post("/login",async(req,res)=>{
    try {
        const {email,password}=req.body
        const exist=await usermodel.findOne({email})
        if(!exist){
            return res.status(400).json("email not registered")
        }
        if(exist.password !== password){
            return res.status(400).json("password doest not match")
        }
        const payload={
            user:{
                id:exist._id
            }
        }
        jwt.sign(payload,"jwt",{expiresIn:"1h"},(err,token)=>{
            if(err) throw err;
            return res.json({token})
            
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json("error message")
    }
})
app.get('/user',middleware,async(req,res)=>{
    try {
        const exist =await usermodel.findById(req.user.id)
        if(!exist){
            return res.json("user not define")
        }
        return res.json(exist)
    } catch (error) {
        return res.status(500).json("server error")
    }
})

app.listen(5000,()=>{
    console.log('server running...');
})