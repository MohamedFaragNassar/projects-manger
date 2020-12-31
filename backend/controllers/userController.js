const User = require("../models/User")
const bcrypt = require("bcrypt")
const {getToken} = require("../Authentication")

const getAllUsers = async(req,res)=>{
    try{
        const users = await User.find()
        res.send(users)
    }catch(err){
        console.log(err)
    }
    
}

const signin = async (req,res)=>{
    const {email, password} = req.body;     
    try{

   
        const signedUser = await User.findOne({email})
        if(signedUser){
            
            const auth = await bcrypt.compare(password, signedUser.password)
            if(auth){
                res.send({
                    userID: signedUser._id,
                    userName: signedUser.userName,
                    userFullName:signedUser.fullName,
                    userImage:signedUser.image,
                    token: getToken(signedUser)
                })
                
            }else{
                res.send("incorrect password")
            }
        }else{
            res.send("Email not found")
        }   
    }catch(error){
        console.log(error)
        res.status(500).send("Somthing went wrong when trying to sign you in")
    }
 }

const registerUser = async(req,res)=>{
      console.log(req.body)
    const checkEmail = await User.findOne({email:req.body.email})
    if(checkEmail){
        res.send("This Email is already registered")
    }else{
        const newUser = new User({
            userName: req.body.userName,
            fullName:req.body.fullName,
            email: req.body.email,
            password: req.body.password
        })
        try{
            const user = await newUser.save()
            if(user){
                res.send("success")
            }
        }catch(error){
            console.log(error)
            res.status(500).send({message:"Somthing went wrong when trying to register you, please try again"})
        }
        
    } 
}

const searchUser = async(req,res) => {
    const keyword = req.query.q
   
    if(keyword){
            try{
            const data = await User.find({
                userName:{
                    $regex: new RegExp(keyword)
                    }
                },{
                   __v:0
                }).limit(15)
            res.send(data)

        }catch(err){
            console.log(err)
            res.status(500).send("somthing went wrong")
        }  
    }else{
        res.send([])
    }
   
} 

module.exports = {
    getAllUsers, registerUser,signin,searchUser
}