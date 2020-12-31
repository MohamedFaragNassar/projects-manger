const User = require("../models/User")
const Project = require("../models/Project")

const searchUsers = (args) => {
    try{
       return User.find({
            email:{
                $regex: new RegExp(args.keyword)
                }
            },{
               __v:0
            }).limit(10) 
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

module.exports = {addUsersGroup,searchUsers}