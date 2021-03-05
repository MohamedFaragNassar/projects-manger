import React from 'react'
import {useMutation} from '@apollo/client'
import {getProjectDetailsQuery
    ,deleteDependaciesForTaskMutation} from '../queries/projectQueries'

const ShowDependacy = ({task,field,id,projectID,isAllowed}) => {
    
    const [deleteDependacy] = useMutation(deleteDependaciesForTaskMutation)

    const deleteDependacyHandler = () => {
        deleteDependacy({
            variables:{
                id,
                taskID:task._id,
                field
            },
            refetchQueries:[{query:getProjectDetailsQuery,variables:{
                id:projectID
            }}]
        })
    }

    return (
        <div className="show-dependacy" style={{background:field==="dependsOn"?"#16c79a":"#f05454"}}>
             <span>{task.name}</span>
            {isAllowed?<button onClick={()=>deleteDependacyHandler()} >
                <i className="fal fa-times-circle"></i>
            </button>:null}
        </div>
    )
}

export default ShowDependacy
