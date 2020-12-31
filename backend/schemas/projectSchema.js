const {buildSchema} = require('graphql');



const schema = buildSchema(`

type userType {
     _id:String,
    userName:String,
    fullName:String,
    email:String,
    image:String,
    favorites:[String]
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
    duration:Int
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
    duration:Int
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



type RootQuery  {
    projects: allProjects
    projectDetails(id:String): projectType
    taskDetails(id:String): taskType
    searchUsers(keyword:String):[userType]
}

type Mutation  {
        addProject(name:String, buckets:[String]):projectType
        deleteProject(id:String):projectType
        addTask(id:String,taskName:String):taskType
        updateTask(id:String,updatedFields:taskInput):taskType
        addBucket(id:String,bucket:String):projectType
        deleteBucket(id:String,bucket:String): projectType
        addTaskToBucket(taskID:String,bucket:String):projectType
        assignTaskToUser(taskID:String,user:userInput!):taskType
        addUsersGroup(id:String,users:[String]):userType
        addFavorites(projectID:String):userType
        delFromFavorites(projectID:String):userType
        addDependaciesForTask(id:String,field:String,taskID:String): taskType
        deleteDependaciesForTask(id:String,field:String,taskID:String): taskType
        leaveProject(id:String): projectType
        deleteTask(id:String): taskType

    }


schema        {
    query:RootQuery
    mutation: Mutation
}

`)

module.exports= {schema}
