import React, { useState } from 'react'
import {useMutation} from '@apollo/client'
import {assignTaskToUserMutation,getProjectDetailsQuery} from '../queries/projectQueries'


const GroupSearch = (props) => {
    const group = props.users
    const taskID = props.taskID
    const projectID = props.projectID
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

    if(! props.isOpen){
        return null
    }
    return (
        <div ref={props.domNode} className="group-search">
            <h3>Search Members</h3>
            <input type="text" />
            <ul>
                {users.map(user => 
                    <li value={user._id} onClick={taskID?(e)=>handleUpdateTask(e):null} >
                        {user.userName}
                    </li>
                )}
            </ul>
            
        </div>
    )
}

export default GroupSearch
