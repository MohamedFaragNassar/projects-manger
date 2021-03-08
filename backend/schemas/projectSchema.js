const {buildSchema} = require('graphql');
const {GraphQLString, GraphQLInt,GraphQLInputObjectType,GraphQLList,GraphQLObjectType,GraphQLSchema} = require('graphql');
const {addBucket,addFavorites,addProject,delFromFavorites,deleteBucket
        ,deleteProject,deleteUserFromProject,leaveProject,projectDetails,projects} = require("../resolvers.js/project")
const {addDependaciesForTask,addTask,addTaskToBucket,assignTaskToUser,deleteDependaciesForTask,
        deleteTask,removeTaskFromUser,taskDetails,updateTask} = require("../resolvers.js/task")
const {addUsersGroup,updatePassword,profile,searchUsers,updateProfile} = require("../resolvers.js/users")

/* const userType  = new GraphQLObjectType ({
    name:"userType",
    fields:()=>({
        _id:{type:GraphQLString},
        userName:{type:GraphQLString},
        fullName:{type:GraphQLString},
        email:{type:GraphQLString},
        image:{type:GraphQLString},
        favorites:new GraphQLList({type:GraphQLString}),
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
        favorites:new GraphQLList({type:GraphQLString})
    })
})


const projectType = new GraphQLObjectType({
   name:"projectType",
   fields:()=>({
       _id:{type:GraphQLString},
       name:{type:GraphQLString},
       buckets:new GraphQLList({type:GraphQLString}),
       tasks:new GraphQLList({type:taskType}),
       owner:{type:userType},
       group:new GraphQLList({type:userType}),
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
        dependants : new GraphQLList({
            type:taskType,
            resolve(args,parent){

            }
        }),
        dependsOn: new GraphQLList({
            type:taskType,
            resolve(args,parent){

            }
        }),
        assignedTo:new GraphQLList({type:userType}),
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
        dependants : new GraphQLList({
            type:taskType,
            resolve(args,parent){

            }
        }),
        dependsOn: new GraphQLList({
            type:taskType,
            resolve(args,parent){

            }
        }),
        assignedTo:new GraphQLList({type:userType}),
        project:{type:projectType},
        bucket:{type:GraphQLString},
        completion:{type:GraphQLInt},
    })
}) 


const allProjects = new GraphQLObjectType ({
    name:"allProjects",
    fields:()=>({
        myProjects: new GraphQLList({type:projectType}),
        sharedProjects: new GraphQLList({type:projectType}),
        favorites :new GraphQLList({type:projectType}),
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
            resolve(parent,args,{user}){
                return projects(user)
            }
        }
    }

})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
    
    }

}) */


const schema = buildSchema(`

type userType {
     _id:String,
    userName:String,
    fullName:String,
    email:String,
    image:String,
    favorites:[String]
    createdAt:String
}

type changePassword {
    id:String
    userName:String
    fullName:String
    email:String
    token:String
}

input userInput {
     _id:String,
    userName:String,
    fullName:String,
    email:String,
    image:String,
    favorites:[String]
}

type taskType  {
    _id:String
    name:String
    start:String
    end:String
    totalEffort:Int
    doneEffort:Int
    dependants:[taskType]
    dependsOn:[taskType]
    assignedTo:[userType]
    project:projectType
    bucket:String
    completion:Int
    
}

input taskInput  {
    _id:String
    name:String
    start:String
    end:String
    totalEffort:Int
    doneEffort:Int
    dependants:[String]
    dependsOn:[String]
    assignedTo:[userInput]
    project:String
    bucket:String
    completion:Int
}


type projectType {
    _id:String,
    name:String,
    buckets:[String]
    tasks:[taskType]
    owner:userType
    group:[userType]
    createdAt:String
}



type allProjects  {
    myProjects: [projectType]
    sharedProjects: [projectType]
    favorites :[projectType]
}

type profileInfo {
    user: userType
    createdProjects:Int
    sharedProjects:Int
}



type RootQuery  {
    projects: allProjects
    projectDetails(id:String): projectType
    taskDetails(id:String): taskType
    searchUsers(keyword:String):[userType]
    profile(id:String):profileInfo
}

type Mutation  {
        addProject(name:String, buckets:[String]):projectType
        deleteProject(id:String):projectType
        addTask(id:String,taskName:String):taskType
        updateTask(id:String,updatedFields:taskInput):taskType
        addBucket(id:String,bucket:String):projectType
        deleteBucket(id:String,bucket:String): projectType
        addTaskToBucket(taskID:String,bucket:String):projectType
        assignTaskToUser(taskID:String,userID:String!):taskType
        addUsersGroup(id:String,users:[String]):userType
        addFavorites(projectID:String):userType
        delFromFavorites(projectID:String):userType
        addDependaciesForTask(id:String,field:String,taskID:String): taskType
        deleteDependaciesForTask(id:String,field:String,taskID:String): taskType
        leaveProject(id:String): projectType
        deleteTask(id:String): taskType
        updateProfile(user:userInput): userType
        changePassword(currentPassword:String,newPassword:String): changePassword
        deleteUserFromProject(projectID:String,userID:String): projectType
        removeTaskFromUser(userID:String,taskID:String): taskType
    }


schema        {
    query:RootQuery
    mutation: Mutation
}

`) 

module.exports = {schema}
/* module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
 */