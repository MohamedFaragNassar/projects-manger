import React, { useEffect, useState } from 'react'
import {useMutation} from '@apollo/client'
import {assignTaskToUserMutation,getProjectDetailsQuery,deleteUserFromProjectMutation} from '../queries/projectQueries'
import {debounce} from '../helpers/helpers'
import {Link} from 'react-router-dom'


const GroupSearch = ({group, taskID, projectID,position,domNode,type,errorHandler}) => {
    const [users,setUsers] = useState(group)
    const [updateTask] = useMutation(assignTaskToUserMutation)
    const [deleteUserFromProject] = useMutation(deleteUserFromProjectMutation)

    const handleUpdateTask = async(userID) => {
        try{
            await updateTask({
                variables:{
                    taskID,
                    userID
                },
                refetchQueries:[{query:getProjectDetailsQuery,variables:{
                    id:projectID
                }}]
            })
        }catch(err){
            errorHandler(err.message)
        }  
    }

    const handleSearchGroup = debounce((element)=>{
        const keyword = element.value
        if(keyword ===""){
            setUsers(group)
        }
        if(keyword){
             const filteredUsers = group.filter(user => user.userName.includes(keyword))
             setUsers(filteredUsers)
         } 
        },100)

    const handleDeleteUser = async(userID)=>{
        try{
            await deleteUserFromProject({
                variables:{
                    projectID,
                    userID
                },
                refetchQueries:[{query:getProjectDetailsQuery,variables:{
                    id:projectID
                }}]
            })
        }catch(err){
            errorHandler(err.message)
        } 

        setUsers(users.filter(user => user._id != userID))
    }
    
    useEffect(() => {
        
    }, [users])
    
    useEffect(() => {
        setUsers(group)
    }, [group])

  

    return (
        <div id="group-search" className={`hide-v ${position}`} >
            <div ref={domNode} className="group-search">
                <h3>Search Members</h3>
                <input className='gen-input' onChange={(e)=>handleSearchGroup(e.target)} type="text" />
                <ul>
                    {type==="show"&&users?users.map(user => 
                        <li key={user._id} value={user._id}>
                            <Link to={`/profile/${user._id}`}>{user.userName}</Link>
                            <button onClick={()=>handleDeleteUser(user._id)}><i className="fas fa-trash-alt"></i></button>
                        </li>
                    ):
                    users&& users.map(user =>
                        <li key={user._id} value={user._id} onClick={(e)=>handleUpdateTask(e.target.attributes.value.value)}>
                            {user.userName}
                        </li>
                    )} 
                </ul>
                
            </div>
        </div>
    )
}

export default GroupSearch
