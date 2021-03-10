import { gql } from '@apollo/client';

const getProjectsQuery = gql`
    {
        projects {
            myProjects{
                _id
                name
                owner{
                    _id
                    userName
                },
                createdAt
                tasks{
                    _id
                }
                group{
                    _id
                }
            },
            sharedProjects{
                _id
                name
                owner{
                    _id
                    userName
                },
                createdAt
                tasks{
                    _id
                }
                group{
                    _id
                }
            },
            favorites{
                _id
                name
                owner{
                    _id
                    userName
                }
                createdAt
                tasks{
                    _id
                }
                group{
                    _id
                }
            },
            

        }
    }
`;

const getProjectDetailsQuery = gql`
    query projectDetails($id:String!){
        projectDetails(id:$id){
            _id
            name
            buckets
            tasks{
                _id
                name
                start
                end
                bucket
                completion
                assignedTo{
                    _id
                    userName
                }
                totalEffort
                doneEffort
                dependsOn{
                    _id
                    name
                }
                dependants{
                    _id
                    name
                }
            }
            owner{
                _id
                userName
            }
            group{
                _id
                userName
               
            }
            createdAt
        }
    }
`



const addProjectMutation = gql`
mutation addProject($name:String!$buckets:[String!]){
    addProject(name: $name,buckets:$buckets){
        name
    }
}
`;
const deleteProjectMutation = gql`
mutation deleteProject($id:String!){
        deleteProject(id:$id){
            _id
            name
        }
    }
`

const addTaskMutation = gql `
mutation addTask($id:String!,$taskName:String!){
    addTask(id:$id,taskName:$taskName){
        _id
        name
    }
}` 

const addBucketMutation = gql`
    mutation addBucket($id:String!,$bucket:String!){
        addBucket(id:$id,bucket:$bucket){
            buckets
        }
    }
`

const addTaskToBucketMutation = gql`
    mutation addTaskToBucket($taskID:String!,$bucket:String!){
        addTaskToBucket(taskID:$taskID,bucket:$bucket){
            buckets
        }
    }
`

const addUsersGroupMutation = gql`
mutation addUsersGroup($id:String!,$users:[String!]){
    addUsersGroup(id:$id,users:$users){
        _id
        userName
    }
} 
`

const updateTaskMutation = gql`
mutation updateTask($id:String,$updatedFields:taskInput!){
    updateTask(id:$id,updatedFields:$updatedFields){
        _id
        name
    }
}
`
const editStartDateMutation = gql`
mutation editStartDate($id:String,$date:String!){
    editStartDate(id:$id,date:$date){
        _id
    }
}
`
const editEndDateMutation = gql`
mutation editEndDate($id:String,$date:String!){
    editEndDate(id:$id,date:$date){
        _id
    }
}
`

const assignTaskToUserMutation = gql`
mutation assignTaskToUser($taskID:String!,$userID:String!){
    assignTaskToUser(taskID:$taskID,userID:$userID){
        _id
    }
}
`
const removeTaskFromUserMutation = gql`
mutation removeTaskFromUser($taskID:String!,$userID:String!){
    removeTaskFromUser(taskID:$taskID,userID:$userID){
        _id
    }
}
`

const addFavoritesMutation = gql`
mutation addFavorites($projectID:String!){
    addFavorites(projectID:$projectID){
        _id
    }
}
`

const deleteFavoritesMutation = gql`
mutation delFromFavorites($projectID:String!){
    delFromFavorites(projectID:$projectID){
        _id
    }
}
`
const deleteBucketmutation = gql`
mutation deleteBucket($id:String!,$bucket:String!){
    deleteBucket(id:$id,bucket:$bucket){
        _id
    }
}
`
const addDependaciesForTaskMutation = gql`
mutation addDependaciesForTask($id:String!,$field:String!,$taskID:String!){
        addDependaciesForTask(id:$id,field:$field,taskID:$taskID){
            _id
        }
    }
`

const deleteDependaciesForTaskMutation = gql`
    mutation deleteDependaciesForTask($id:String!,$field:String!,$taskID:String!){
        deleteDependaciesForTask(id:$id,field:$field,taskID:$taskID){
            _id
        }
    }
`
const leaveProjectMutation = gql`
mutation leaveProject($id:String!){
    leaveProject(id:$id){
        _id
    }
}
`
const deleteeTaskMutation = gql`
mutation deleteTask($id:String!){
    deleteTask(id:$id){
        _id
    }
}
`

const getProfileInfoQuery = gql`
    query profile($id:String!){
        profile(id:$id){
            user{
                _id
                userName
                fullName
                email
                image
                createdAt
            }
            createdProjects
            sharedProjects
        }
    }
`

const updateProfileMutation = gql`
mutation updateProfile($user:userInput!){
    updateProfile(user:$user){
        _id
    }
}
`

const changePasswordMutation = gql`
mutation changePassword($currentPassword:String,$newPassword:String){
    changePassword(currentPassword:$currentPassword,newPassword:$newPassword){
        id
        userName
        fullName
        email
        token
    
    }
}
`

const deleteUserFromProjectMutation = gql`
mutation deleteUserFromProject($projectID:String!,$userID:String!){
    deleteUserFromProject(projectID:$projectID,userID:$userID){
        _id
    }
}
`

export {getProjectsQuery,addProjectMutation,getProjectDetailsQuery
    ,addTaskMutation,deleteProjectMutation,deleteeTaskMutation
    ,addUsersGroupMutation,addBucketMutation,addTaskToBucketMutation
    ,updateTaskMutation,assignTaskToUserMutation,addFavoritesMutation
    ,deleteFavoritesMutation,deleteBucketmutation,leaveProjectMutation
    ,addDependaciesForTaskMutation,deleteDependaciesForTaskMutation,
    getProfileInfoQuery,updateProfileMutation,changePasswordMutation,
    deleteUserFromProjectMutation,removeTaskFromUserMutation,
    editStartDateMutation,editEndDateMutation}