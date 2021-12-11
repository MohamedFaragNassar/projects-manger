import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {useClickToClose} from '../helpers/CTC'
import {useMutation} from '@apollo/client'
import {getProjectDetailsQuery,removeTaskFromUserMutation} from '../queries/projectQueries'

const Assigh = ({users,taskID,projectID,type,isAllowed}) => {
    const [isOpen,setIsOpen] = useState(false)

    const node = useClickToClose(()=>setIsOpen(false),"#usrmenu")

    const [removeUser] = useMutation(removeTaskFromUserMutation)

    const handleDelUserFromTask = (id) =>{
        removeUser({
            variables:{
                userID:id,
                taskID
            },
            refetchQueries:[{query:getProjectDetailsQuery,variables:{id:projectID}}]
        })
    }

    return <>
        <div className="assign">
           {type=="grid" && <div className="assign-top">
                {users.slice(0,2).map(user => 
                    <Link key={user._id} to={`/profile/${user._id}`} >
                        <img className="user-img" src={`../${user._id}.jpg`} onError={(e)=>e.target.src="../account.jpg"} />
                    </Link>    
                )}
            </div>}
            <div className="assign-bottom">
                <button className="users-btn" onClick={()=>setIsOpen(true)} >
                    {users.length > 2 && type=="grid"&&` and  ${users.length -2} more `}
                    {users.length> 0 &&<i style={{fontSize:15+"px",color:"#1687a7"}} className="fas fa-ballot"></i>}
                </button>
                {isOpen&&<div ref={node} id="usrmenu" className="assign-model">
                    {users.map(user => <div>
                        <Link key={user._id} to={`/profile/${user._id}`}>
                            <img className="user-img" src={`../${user._id}.jpg`}  onError={(e)=>e.target.src="../account.jpg"} />
                            <span className="user-name ">{user.userName}</span>
                        </Link>
                        {isAllowed&&<button onClick={()=>handleDelUserFromTask(user._id)}>
                            <i className="fas fa-trash-alt"></i>
                        </button>}   
                        </div>
                    )}
                </div>}
            </div>
        </div>
    </>
}

export default Assigh
