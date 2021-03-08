const Project = require("../models/Project")
const Task = require("../models/Task")
const User = require("../models/User")

const projects = async (args,{user}) => {
  try{
        const myProjects = await Project.find({owner:user}).sort({ createdAt : -1})
        const sharedProjects = await Project.find({group:user}).sort({ createdAt : -1})
        const userData = await User.findById(user._id)
        const favorites = await Project.find({_id:{$in:userData.favorites}}).sort({ createdAt : -1})
        return {myProjects, sharedProjects,favorites} 
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
}

const projectDetails = async (args,{user}) => {
    try{
        const project = await Project.findById(args.id)
        const tasks = await Task.find({project:project._id})
        const group = await User.find({_id:{$in:project.group}})
        
        project.tasks = tasks
        project.group = group

        return project
    }catch(error){
        console.log(error)
        throw new Error(error)
    }
}

const addProject = (args,{user}) => {
    const project = new Project({
        name:args.name,
        createdAt:Date.now(), 
        buckets:args.buckets,
        owner:user 
    })
    return project.save()
}

const deleteProject = async (args,{user}) => {
    try{
        const project = await Project.findById(args.id)
        if(project.owner == user._id){
            return project.remove();
        }else{
            throw new Error("You are not allowed to perform this action")
        }
    }catch(error){
        console.log(error)
        throw new Error(error)
    }
}

const addBucket =  async (args,{user}) => {
    try{
        const project = await Project.findById(args.id)
        if(project.owner == user._id){
            project.buckets.push(args.bucket);
            return  project.save();
        }else{
            throw new Error("You are not allowed to perform this action")
        } 
    }catch(error){
        console.log(error)
        throw new Error("somthing went wrong " + error)
    } 
}

const deleteBucket =  async (args,{user}) => {
    try{
        const project = await Project.findById(args.id)
        if(project.owner == user._id){
            project.buckets = project.buckets.filter(bucket => {return bucket != args.bucket})
            const tasks = await Task.find({bucket:args.bucket})
            for(let i=0; i<tasks.length; i++){
                const task =  tasks[i]
                task.bucket = null
                await task.save()
            }
            return  project.save();
        }else{
            throw new Error("You are not allowed to perform this action")
        } 
    }catch(error){
        console.log(error)
        throw new Error("somthing went wrong " + error)
    } 
}

const addFavorites =  async (args,{user}) => {
    try{
        const userData = await User.findById(user._id)
        return userData.updateOne({favorites:[...userData.favorites,args.projectID]})
    }catch(error){
            throw new Error(error)
    }
}


const delFromFavorites = async (args,{user}) => {
    try{
        const userData = await User.findById(user._id)
       return userData.updateOne({favorites:userData.favorites.filter( project =>  { return project != args.projectID})})
    }catch(error){
            throw new Error(error)
    }
}

const leaveProject = async ({id},{user}) => {
    try{
        const project = await Project.findById(id)
        project.group=project.group.filter(member => {return member != user._id})
        return project.save()
    }catch(error){
        throw new Error(error)
    }
}

const deleteUserFromProject = async ({projectID,userID},{user}) => {
    try{
        const project = await Project.findById(projectID)
        if(!(project.owner == user._id)){
            throw new Error("You are not authorized to delete this project")
        }
        project.group=project.group.filter(member => {return member != userID})
        return project.save()
    }catch(error){
        throw new Error(error)
    }
}



module.exports = {
    projects,projectDetails,addProject,
    addBucket,addFavorites,deleteProject,
    delFromFavorites,deleteBucket,leaveProject,deleteUserFromProject
}