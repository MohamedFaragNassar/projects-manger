import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {deleteProjectMutation,getProjectsQuery,addFavoritesMutation
    ,deleteFavoritesMutation,leaveProjectMutation} from '../queries/projectQueries'
import {modifyDate} from '../helpers/helpers'


const ShowProjects = (props) => {
    const {data,type,favorites} = props

    const [page,setPage] = useState(1)
    const limit = 10
    const startIndex = (page -1 ) * limit
    const endIndex = page * limit
    const [delProject] = useMutation(deleteProjectMutation)
    const [addFavorites] = useMutation(addFavoritesMutation)
    const [delFavorites] = useMutation(deleteFavoritesMutation)
    const [leaveProject] = useMutation(leaveProjectMutation)



    const handleDeleteProject = (id) => {
        delProject({
            variables:{id},
            refetchQueries:[{query:getProjectsQuery}]
        })
    }

    const handleAddFavorites = (projectID) =>{
        addFavorites({
            variables:{
                projectID
            },
            refetchQueries:[{query:getProjectsQuery}]
        })
    }

    const handleRemoveFromFavorites = (id)=>{
        delFavorites({
          variables:{
            projectID:id,
          },
          refetchQueries:[{query:getProjectsQuery}]
        })
    }

    const handleLeaveProject = (id) => {
        leaveProject({
            variables:{
                id
            },
            refetchQueries:[{query:getProjectsQuery}]
        })
    }
    
    let pagesnum = Math.ceil(data.length/limit)
    let pages = [] 
    for (let i=1 ; i<= pagesnum ; i++){
            pages.push(i)
        }
    
        console.log(page)

    return (
        <div className="show-projects">
                    <ul>
                        <li>
                            <img src="./share.svg"/>
                            <img src="calendar.svg"/>
                            <img src="checklist.svg"/>
                            <img src="user.svg"/>
                            <span></span>
                        </li>
                        {data.slice(startIndex,endIndex).map(proj => 
                            <li  key={proj._id} >
                                <div>
                                    <Link to={`/project/${proj._id}`}>{proj.name}</Link>
                                </div>
                                <span>{modifyDate(proj.createdAt)}</span>
                                <span>{`${proj.tasks.length} tasks`}</span>
                                <span>{`${proj.group.length} members`}</span>
                                <div>
                                    {favorites.some(pr => pr._id == proj._id)?
                                    <button onClick={()=>handleRemoveFromFavorites(proj._id)} ><i className="fas fa-star"></i></button>
                                    :<button onClick={()=>handleAddFavorites(proj._id)}><i className="far fa-star"></i></button>}
                                   {props.type === "mine" ? <button onClick={()=>handleDeleteProject(proj._id)}>
                                       <i className="fas fa-trash-alt"></i>
                                    </button> :<button onClick={()=>handleLeaveProject(proj._id)} ><i className="fas fa-sign-out"></i></button> }
                                </div>
                            </li>
                            )}
                    </ul>
                    <div className="pagination-btns">
                        {pages.map(num => 
                            <button key={num} value={num} onClick={(e)=>setPage(e.target.value)} >{num}</button>    
                        )}
                    </div>
                </div>
    )
}

export default ShowProjects
