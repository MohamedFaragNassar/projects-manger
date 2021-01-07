import React, { useState } from 'react'
import {useMutation} from '@apollo/client'
import {assignTaskToUserMutation,getProjectDetailsQuery} from '../queries/projectQueries'
import {debounce} from '../helpers/helpers'


const GroupSearch = ({group, taskID, projectID,position,domNode}) => {
    const [users,setUsers] = useState(group)
    const [updateTask] = useMutation(assignTaskToUserMutation)

    const handleUpdateTask = (e) => {
        const userID = e.target.attributes.value.value
        updateTask({variables:{
            taskID,
            user:{
                _id:userID
            }
        },
        refetchQueries:[{query:getProjectDetailsQuery,variables:{
            id:projectID
        }}]
    }) 
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

        

    return (
        <div id="group-search" className={`hide-v ${position}`} >
            <div ref={domNode} className="group-search">
            <h3>Search Members</h3>
            <input onChange={(e)=>handleSearchGroup(e.target)} type="text" />
            <ul>
                {users&&users.map(user => 
                    <li value={user._id} onClick={taskID?(e)=>handleUpdateTask(e):null} >
                        {user.userName}
                    </li>
                )} 
            </ul>
            
            </div>
        </div>
    )
}

export default GroupSearch
