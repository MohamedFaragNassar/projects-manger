const User = require("../models/User")
const Project = require("../models/Project")
const project = require("../models/Project")
const bcrypt = require("bcrypt")
const {getToken} = require("../Authentication")

const searchUsers = async(args,{user}) => {
    try{
       const users = await User.find({
            userName:{
                $regex: new RegExp(args.keyword)
                }
            },{
               __v:0
            }).limit(10) 
        return users.filter(usr => usr._id != user._id)
    }catch(err){
        console.log(error)
        throw new Error(err)
    }
    
}

const addUsersGroup =  async (args,{user}) => {
    try{
        const project = await Project.findById(args.id)
        if(!project){
            throw new Error("no project with this id")
        }
        if(project.owner == user._id ){
            const usersGroup = await User.find({_id:{$in: args.users}})
            const users = [... new Set([...project.group,...usersGroup])]
            project.group = [...users]
            return project.save()
        }else{
            throw new Error("You are not allowed to perform this action")
        }
    }catch(error){
        console.log(error)
        throw new Error(error)
    }
}

const profile = async({id}) =>{
    try{
        const user = await User.findById(id)
        const createdProjects = await project.find({owner:id}).countDocuments()
        const sharedProjects = await project.find({group:id}).countDocuments()
        return {user,createdProjects,sharedProjects}
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
} 

const updateProfile =async(args,{user})=>{
    try{
        const updatedUser = await User.findById(user._id)
        const checkEmail = await User.findOne({email:args.user.email})
        if(checkEmail){
            if(!(args.user.email == updatedUser.email)){
                throw new Error("this email is already excist")
            }
        }
        const checkUserName = await User.findOne({userName:args.user.userName})
        if(checkUserName){
            if(!(args.user.userName == updatedUser.userName)){
                throw new Error("this userName is already excist")
            }
        }
        return updatedUser.updateOne(args.user)
        
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
}

const updatePassword = async({currentPassword,newPassword},{user}) => {
    try{
        const passwordValidation= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,100}$/
        const updatedUser = await User.findById(user._id)
        const checkPassword = await bcrypt.compare(currentPassword, updatedUser.password)
        console.log(checkPassword)
        if(!checkPassword){
            throw new Error("incorrect password")
        }
        if(!newPassword.match(passwordValidation)){
            throw new Error("password must be at least 8 charaters with contain at least one numeric digit, \
            one uppercase and one lowercase letter")
        }

        updatedUser.password = newPassword
        await updatedUser.save()
        return{
            id: updatedUser._id,
            userName: updatedUser.userName,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            token: getToken(updatedUser)
        }
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
}

module.exports = {addUsersGroup,searchUsers,profile,updateProfile,updatePassword}