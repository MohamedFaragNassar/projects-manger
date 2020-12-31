const Project = require("../models/Project")
const User = require("../models/User")
const Task = require("../models/Task")
const { findById } = require("../models/Project")

const taskDetails = (parent,args) => {
    return Task.findById(args.id)
}

const addTask = async (args,{user}) => {
    try{
        const project = await Project.findById(args.id)
        if(project.owner ==  user._id ){
            const newTask = new Task({
                name:args.taskName,
                project:project
            })
            return newTask.save()
        }else{
            throw new Error("You are not allowed to perform this action")
        } 
    }catch(error){
        console.log(error)
        throw new Error("somthing went wrong " + error)
    }

}

const updateTask = async (args,{user}) => {
    try{
        const task = await Task.findById(args.id)
        const project = await Project.findById(task.project)
        if(project.owner == user._id || task.assignedTo.includes(user._id) ){
            return task.updateOne({...args.updatedFields})
        }else{
            throw new Error("You are not allowed to perform this action")
        }
    }catch(error){
        console.log(error)
        throw new Error("somthing went wrong " + error)
    }
}


 const addTaskToBucket = async (args,{user}) => {
    try{
       const task = await Task.findById(args.taskID)
       const project = await Project.findById(task.project)
        if(project.owner == user._id){
            if(task){
                task.bucket = args.bucket
                return task.save()
            }else{
                throw new Error("no task with this id")
            } 
        }else{
            throw new Error("You are not allowed to perform this action")
        }
        
    }catch(error){
        console.log(error)
        throw new Error("somthing went wrong " + error)
    } 
 }


 const assignTaskToUser = async (args,{user}) => {
    try{
        const task = await Task.findById(args.taskID)
        const project = await Project.findById(task.project)
        const addedUser = await User.findById(args.user._id)
        if(project.owner == user._id){
            if(task && user){
                if(!task.assignedTo.includes(addedUser._id)){
                    task.assignedTo = [...task.assignedTo,addedUser]
                    return task.save()
                   }
                   else{
                       return{}
                   }
            }else{
                throw new Error("no task with this id")
            } 
        }else{
            throw new Error("You are not allowed to perform this action")
        }
     }catch(error){
         console.log(error)
         throw new Error("somthing went wrong " + error)
    } 
}

const addDependaciesForTask = async (args,{user})=>{
    try{
        const task = await Task.findById(args.id)
        const project = await Project.findById(task.project)
        const addedTask = await Task.findById(args.taskID)
        if(project.owner == user._id){
            if(args.field ==="dependsOn"){
                const taskDate = new Date(task.start)
                const addedTaskDate = new Date(addedTask.end)
                if(addedTaskDate.getTime() > taskDate.getTime()){
                    task.start = addedTask.end
                }
                task.dependsOn = [...task.dependsOn,addedTask._id]
                addedTask.dependants = [...addedTask.dependants,task._id]
            }else if(args.field === "dependants"){
                const taskDate = new Date(task.end)
                const addedTaskDate = new Date(addedTask.start)
                if(addedTaskDate.getTime() < taskDate.getTime()){
                    addedTask.start = task.end
                }
                task.dependants = [...task.dependants,addedTask._id] 
                addedTask.dependsOn = [...addedTask.dependsOn,task._id]
            }
            await addedTask.save()
            return task.save()
        }else{
            throw new Error("You are not allowed to perform this action")
        }
    }catch(error){
        console.log(error)
        throw new Error(error)
    }
}

const deleteDependaciesForTask = async (args,{user})=>{
    try{
        const task = await Task.findById(args.id)
        const project = await Project.findById(task.project)
        const deletedTask = await Task.findById(args.taskID)
        if(project.owner == user._id){
            if(args.field ==="dependsOn"){
                task.dependsOn = task.dependsOn.filter(task => {return task != args.taskID})
                deletedTask.dependants = deletedTask.dependants.filter(item => {return item != args.id})
            }else if(args.field === "dependants"){
                task.dependants = task.dependants.filter(task => {return task != args.taskID})
                deletedTask.dependsOn = deletedTask.dependsOn.filter(item => {return item != args.id})
            }
            await deletedTask.save()
            return task.save()
        }else{
            throw new Error("You are not allowed to perform this action")
        }
    }catch(error){
        console.log(error)
        throw new Error(error)
    }
}

const deleteTask = ({id}) => {
    try{
        return Task.findByIdAndDelete(id)
    }catch(error){
        console.log(error)
        throw new Error(error)
    }
} 

module.exports = {
    addTask,updateTask,taskDetails,addTaskToBucket,assignTaskToUser,
    addDependaciesForTask,deleteDependaciesForTask,deleteTask
}