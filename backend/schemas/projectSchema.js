const {GraphQLString, GraphQLInt,GraphQLInputObjectType,GraphQLList,GraphQLObjectType,GraphQLSchema} = require('graphql');
const Project = require("../models/Project")
const Task = require("../models/Task")
const User = require("../models/User")

 const userType  = new GraphQLObjectType ({
    name:"userType",
    fields:()=>({
        _id:{type:GraphQLString},
        userName:{type:GraphQLString},
        fullName:{type:GraphQLString},
        email:{type:GraphQLString},
        image:{type:GraphQLString},
        favorites:{ type: new GraphQLList(GraphQLString) },
        createdAt:{type:GraphQLString},
    })
   
})


const changePassword = new GraphQLObjectType ({
    name:"changePassword",
    fields:()=>({
        id:{type:GraphQLString},
        userName:{type:GraphQLString},
        fullName:{type:GraphQLString},
        email:{type:GraphQLString},
        token:{type:GraphQLString}
    })
})


const userInput = new GraphQLInputObjectType ({
    name:"userInput",
    fields:()=>({
        _id:{type:GraphQLString},
        userName:{type:GraphQLString},
        fullName:{type:GraphQLString},
        email:{type:GraphQLString},
        image:{type:GraphQLString},
        favorites:{ type: new GraphQLList(GraphQLString) },
    })
})


const projectType = new GraphQLObjectType({
   name:"projectType",
   fields:()=>({
       _id:{type:GraphQLString},
       name:{type:GraphQLString},
       buckets:{ type: new GraphQLList(GraphQLString) },
       tasks:{ 
           type: new GraphQLList(taskType),
           resolve(parent,args){
               return Task.find({project:parent._id})
           } 
        },
       owner:{type:userType},
       group: { 
           type: new GraphQLList(userType),
           resolve(parent,args){
               return User.find({_id:{$in:parent.group}})
           } 
        },
       createdAt:{type:GraphQLString},

   })
})


const taskType = new GraphQLObjectType ({
    name:"taskType",
    fields:()=>({
        _id:{type:GraphQLString},
        name:{type:GraphQLString},
        start:{type:GraphQLString},
        end:{type:GraphQLString},
        totalEffort:{type:GraphQLInt},
        doneEffort:{type:GraphQLInt},
        dependants : { 
            type: new GraphQLList(taskType),
            resolve(parent,args){
               return Task.find({_id:{$in:parent.dependants}})
            }
        },
        dependsOn:  { 
            type: new GraphQLList(taskType),
            resolve(parent,args){
                return Task.find({_id:{$in:parent.dependsOn}})
            }
        },
        assignedTo: { type: new GraphQLList(userType) },
        project:{type:projectType},
        bucket:{type:GraphQLString},
        completion:{type:GraphQLInt},
    })
})

const taskInput = new GraphQLInputObjectType({
    name:"taskInput",
    fields:()=>({
        _id:{type:GraphQLString},
        name:{type:GraphQLString},
        start:{type:GraphQLString},
        end:{type:GraphQLString},
        totalEffort:{type:GraphQLInt},
        doneEffort:{type:GraphQLInt},
        dependants : { 
            type: new GraphQLList(taskInput),
         },
        dependsOn: { 
            type: new GraphQLList(taskInput),
        },
        assignedTo:{ type: new GraphQLList(userInput) },
        bucket:{type:GraphQLString},
        completion:{type:GraphQLInt},
    })
}) 


const allProjects = new GraphQLObjectType ({
    name:"allProjects",
    fields:()=>({
        myProjects: { type: new GraphQLList(projectType) },
        sharedProjects: { type: new GraphQLList(projectType) },
        favorites :{ type: new GraphQLList(projectType) },
    })
})

const profileInfo = new GraphQLObjectType ({
    name:"profileInfo",
    fields:()=>({
        user:{type:userType},
        createdProjects:{type:GraphQLInt},
        sharedProjects:{type:GraphQLInt}
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        projects:{
            type:allProjects,
            async resolve(parent,args,{user}){
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
        },
        projectDetails:{
            type:projectType,
            args:{id:{type:GraphQLString}},
            async resolve(parent,args,{user}){
                try{
                    return Project.findById(args.id)
                }catch(error){
                    console.log(error)
                    throw new Error(error)
                }
            }
        },
        taskDetails:{
            type:taskType,
            args:{id:{type:GraphQLString}},
            resolve(parent,args,{user}){
                return Task.findById(args.id)
            }
        },
        searchUsers:{
            type:new GraphQLList(userType),
            args:{keyword:{type:GraphQLString}},
            async resolve(parent,args,{user}){
                try{
                    const users = await User.find({
                         email:{
                             $regex: new RegExp(args.keyword)
                             }
                         },{
                            __v:0
                         }).limit(10) 
                     return users.filter(usr => usr._id != user._id)
                 }catch(err){
                     console.log(err)
                     throw new Error(err)
                 }
            }
        },
        profile:{
            type:profileInfo,
            args:{id:{type:GraphQLString}},
            async resolve(parent,{id},{user}){
                try{
                    const user = await User.findById(id)
                    const createdProjects = await Project.find({owner:id}).countDocuments()
                    const sharedProjects = await Project.find({group:id}).countDocuments()
                    return {user,createdProjects,sharedProjects}
                }catch(err){
                    console.log(err)
                    throw new Error(err)
                }
            }
        },

    }

})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addProject:{
            type:projectType,
            args:{name:{type:GraphQLString},buckets:{type:new GraphQLList(GraphQLString)}},
            async resolve(parent,args,{user}){
                const project = new Project({
                    name:args.name,
                    createdAt:Date.now(), 
                    buckets:args.buckets,
                    owner:user  
                })
                return project.save()
            }
        },
        deleteProject:{
            type:projectType,
            args:{id:{type:GraphQLString}},
            async resolve(parent,args,{user}){
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
        },
        addTask:{
            type:taskType,
            args:{id:{type:GraphQLString},taskName:{type:GraphQLString}},
            async resolve(parent,args,{user}){
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
        },
        updateTask:{
            type:taskType,
            args:{id:{type:GraphQLString},updatedFields:{type:taskInput}},
            async resolve(parent,{updatedFields,id},{user}){
                try{
                    const task = await Task.findById(id)
                    const project = await Project.findById(task.project)
                    if(project.owner == user._id || task.assignedTo.includes(user._id) ){
                        return task.updateOne({...updatedFields})
                    }else{
                        throw new Error("You are not allowed to perform this action")
                    }
                }catch(error){
                    console.log(error)
                    throw new Error("somthing went wrong " + error)
                }
            }
        },
        editStartDate:{
            type:taskType,
            args:{id:{type:GraphQLString},date:{type:GraphQLString}},
            async resolve(parent,{id,date},{user}){
                try{
                    const task = await Task.findById(id)
                    const project = await Project.findById(task.project)
                    if(project.owner == user._id || task.assignedTo.includes(user._id) ){
                        let valid = true;
                        const newDate = new Date(date)
                        const proJectDate = new Date(project.createdAt)
                        dependsOn = await Task.find({_id:{$in:task.dependsOn}})
                        dependsOn.map(e => {
                            const taskDate = new Date(e.end) || null;
                            console.log(taskDate)
                            if(taskDate && taskDate.getTime() > newDate.getTime()){
                                return valid = false;
                            }
                        })
                        console.log(valid)
                        if(newDate.getTime() < proJectDate.getTime()){
                            throw new Error("Task start date can not be before project start date")
                        }else if(!valid){
                            throw new Error("the date you provided is not valid, please check the the relations of this task")
                        }

                        task.start = date;
                        return task.save()

                    }else{
                        throw new Error("You are not allowed to perform this action")
                    }
                }catch(error){
                    console.log(error)
                    throw new Error("somthing went wrong " + error)
                }
            }
        },
        editEndDate:{
            type:taskType,
            args:{id:{type:GraphQLString},date:{type:GraphQLString}},
            async resolve(parent,{id,date},{user}){
                try{
                    const task = await Task.findById(id)
                    const project = await Project.findById(task.project)
                    if(project.owner == user._id || task.assignedTo.includes(user._id) ){
                        const newDate = new Date(date)
                        dependants = await Task.find({_id:{$in:task.dependants}})
                        dependants.map(e => {
                            const taskDate = new Date(e.start) || null;
                            if(taskDate && taskDate.getTime() < newDate.getTime()){
                                const endDate = new Date(e.end)
                                const newEndDate = new Date((newDate.getTime()+(endDate.getTime()-taskDate.getTime())))
                                e.start = date
                                e.end = newEndDate
                                return e.save();
                            }
                        })
                        
                        task.end = date;
                        return task.save()

                    }else{
                        throw new Error("You are not allowed to perform this action")
                    }
                }catch(error){
                    console.log(error)
                    throw new Error("somthing went wrong " + error)
                }
            }
        },
        addBucket:{
            type:projectType,
            args:{id:{type:GraphQLString},bucket:{type:GraphQLString}},
            async resolve(parent,args,{user}){
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
        },
        deleteBucket:{
            type:projectType,
            args:{id:{type:GraphQLString},bucket:{type:GraphQLString}},
            async resolve(parent,args,{user}){
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
        },
        addTaskToBucket:{
            type:projectType,
            args:{taskID:{type:GraphQLString},bucket:{type:GraphQLString}},
            async resolve(parent,args,{user}){
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
        },
        assignTaskToUser:{
            type:taskType,
            args:{taskID:{type:GraphQLString},userID:{type:GraphQLString}},
            async resolve(parent,{taskID,userID},{user}){
                try{
                    const task = await Task.findById(taskID)
                    const project = await Project.findById(task.project)
                    const addedUser = await User.findById(userID)
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
        },
        addUsersGroup:{
            type:userType,
            args:{id:{type:GraphQLString},users:{type:new GraphQLList(GraphQLString)}},
            async resolve(parent,args,{user}){
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
        },
        addFavorites:{
            type:userType,
            args:{projectID:{type:GraphQLString}},
            async resolve(parent,args,{user}){
                try{
                    const userData = await User.findById(user._id)
                    return userData.updateOne({favorites:[...userData.favorites,args.projectID]})
                }catch(error){
                    throw new Error(error)
                }
            }
        },
        delFromFavorites:{
            type:userType,
            args:{projectID:{type:GraphQLString}},
            async resolve(parent,args,{user}){
                try{
                    const userData = await User.findById(user._id)
                   return userData.updateOne({favorites:userData.favorites.filter( project =>  { return project != args.projectID})})
                }catch(error){
                        throw new Error(error)
                }
            }
        },
        addDependaciesForTask:{
            type:taskType,
            args:{id:{type:GraphQLString},field:{type:GraphQLString},taskID:{type:GraphQLString}},
            async resolve(parent,args,{user}){
                try{
                    const task = await Task.findById(args.id)
                    const project = await Project.findById(task.project)
                    const addedTask = await Task.findById(args.taskID)
                    if(project.owner == user._id){
                        if(args.field ==="dependsOn"){
                            const taskDate = new Date(task.start)
                            const addedTaskDate = new Date(addedTask.end)
                            if(addedTaskDate.getTime() > taskDate.getTime() || !addedTask.start){
                                task.start = addedTask.end
                            }
                            task.dependsOn = [...task.dependsOn,addedTask._id]
                            addedTask.dependants = [...addedTask.dependants,task._id]
                        }else if(args.field === "dependants"){
                            const taskDate = new Date(task.end)
                            const addedTaskDate = new Date(addedTask.start)
                            if(addedTaskDate.getTime() < taskDate.getTime() || !addedTask.start ){
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
        },
        deleteDependaciesForTask:{
            type:taskType,
            args:{id:{type:GraphQLString},field:{type:GraphQLString},taskID:{type:GraphQLString}},
            async resolve(parent,args,{user}){
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
        },
        leaveProject:{
            type:projectType,
            args:{id:{type:GraphQLString}},
            async resolve(parent,{id},{user}){
                try{
                    const project = await Project.findById(id)
                    project.group=project.group.filter(member => {return member != user._id})
                    return project.save()
                }catch(error){
                    throw new Error(error)
                }
            }
        },
        deleteTask:{
            type:taskType,
            args:{id:{type:GraphQLString}},
            async resolve(parent,{id},{user}){
                try{
                    return Task.findByIdAndDelete(id)
                }catch(error){
                    console.log(error)
                    throw new Error(error)
                }
            }
        },
        updateProfile:{
            type:userType,
            args:{user:{type:userInput}},
            async resolve(parent,args,{user}){
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
        },
        changePassword:{
            type:changePassword,
            args:{currentPassword:{type:GraphQLString},newPassword:{type:GraphQLString}},
            async resolve(parent,{currentPassword,newPassword},{user}){
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
        },
        deleteUserFromProject:{
            type:projectType,
            args:{projectID:{type:GraphQLString},userID:{type:GraphQLString}},
            async resolve(parent,{projectID,userID},{user}){
                try{
                    const project = await Project.findById(projectID)
                    if(!(project.owner == user._id)){
                        throw new Error("You are not authorized to delete this project")
                    }
                    project.group=project.group.filter(member => {return member != userID})
                    const tasks = await Task.find({project:project._id})
                    tasks.forEach(task => {
                        task.assignedTo = task.assignedTo.filter(user => user._id != userID)
                        return task.save()
                    })
                    return project.save()
                }catch(error){
                    throw new Error(error)
                }
            }
        },
        removeTaskFromUser:{
            type:taskType,
            args:{userID:{type:GraphQLString},taskID:{type:GraphQLString}},
            async resolve(parent,{userID,taskID},{user}){
                const task = await Task.findById(taskID)
                const project = await Project.findById(task.project)
                try{
                    if(project.owner == user._id){
                        const filteredUsers = task.assignedTo.filter(e => e._id != userID)
                        task.assignedTo = filteredUsers
                        return task.save()
                    }else{
                        throw new Error("You are not allowed to perform this action")
                    }
                }catch(err){
                    console.log(error)
                    throw new Error("somthing went wrong " + error)
                }
            }
        },

    }

}) 


 module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
