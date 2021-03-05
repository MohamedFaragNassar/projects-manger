import React, { useEffect, useState } from 'react'
import Grid from '../components/Grid'
import Board from '../components/Board'
import Timline from '../components/Timline'
import {getProjectDetailsQuery} from '../queries/projectQueries'
import {useQuery} from '@apollo/client'
import AddUsers from '../components/AddUsers'
import GroupSearch from '../components/GroupSearch'
import {useClickToClose} from '../helpers/CTC'
import Filters from '../components/Filters'
import Status from '../components/Status'




const ProjectScreen = (props) => {
    const userData = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null 
    let userID 
    if(userData){
        userID = userData.id
    }
    const id = props.match .params.id;
    
    const [addUserOpen,setAddUserOpen] = useState(false)
    const [view,setView] = useState("grid")
    const [tasks,setTasks] = useState([])
    const [from,setFrom] = useState(0)
    const [to,setTo] = useState(0)
    const [zoom,setZoom] = useState(50)
    const [filters,setFilters] = useState([])
    const [boardfilter,setBoardFilter] = useState("bucket")


    const hideGroupSearch = ()=>{
        const menu = document.getElementById("group-search")
        menu.classList.add("hide-v")
    }
    const showGroupSearch = ()=>{
        const menu = document.getElementById("group-search")
        menu.classList.remove("hide-v")
    }

    const domNode = useClickToClose(hideGroupSearch,".group-search")

    
    const {loading,error,data} = useQuery(getProjectDetailsQuery,{
        variables:{
            id
        }
    })

    let project
    if(data){
        project  = data.projectDetails
    }

    const showFilters = ()=>{
        const filters = document.querySelector(".filters-panel")
        filters.classList.remove("hide-v")
    }

    const hideFilters = ()=>{
        const filters = document.querySelector(".filters-panel")
        filters.classList.add("hide-v")
    }

    const filtersNode = useClickToClose(hideFilters,".filters-panel")

    const filterByUser = (element) => {
        setTasks( tasks.filter(task =>{return task.assignedTo.some(user => user._id === element.value)}))
        setFilters([...filters,{filter:"Group Member",value:element.attributes.name.value}])
    }
    
    const filterByBucket =(bucket) =>{
        setTasks(tasks.filter(task => {return task.bucket === bucket}))
        setFilters([...filters,{filter:"Bucket",value:bucket}])
    }

    const filterByCompletion = () =>{
        setTasks(tasks.filter(task => {return task.completion >= from && task.completion <= to }))
        setFilters([...filters,{filter:"Completion",value:`from : ${from} to : ${to}`}])
    }

    const filterByDuration = () => {
        setTasks(tasks.filter(task => {return task.duration >= from && task.completion <= to }))
        setFilters([...filters,{filter:"Duration",value:`from : ${from} to : ${to}`}])
    }

    const clearFilters = ()=>{
        setTasks(project.tasks)
        setFilters([])
    }

 
   

    useEffect(() => {
       
       if(project){
           setTasks(project.tasks)
       }
    }, [data,props])
    
    return <>
       { loading ? 
            <div>loading</div>
        : error ?
            <Status isOpen={true} message={error.message} />
       :data? 
       <div className="project-page" >
           <div className="proj-header">
                <div>
                    <h1>{project.name}</h1>
                    <div className="view-links">
                        <button onClick={()=>setView("grid")} >Grid</button>
                        <button onClick={()=>setView("board")} >Board</button>
                        <button onClick={()=>setView("timline")} >Timeline</button>
                    </div>
                </div>
                <div className="manage" >
                    <div className="filter" >
                       {view === "board" ? 
                        <>
                            <label>Group by </label>
                            <select defaultValue={boardfilter} >
                                <option onClickCapture={(e)=>setBoardFilter(e.target.value)}>bucket</option>
                                <option  onClickCapture={(e)=>setBoardFilter(e.target.value)} >progresion</option>
                            </select>
                        </> 
                        : view==="grid"?
                        <>
                            <div className="filters" >
                                <button onClick={()=>showFilters()}>
                                    ({filters.length}) filters
                                    <i class="fas fa-filter"></i>
                                    </button>
                                <Filters project={project} filterByCompletion={filterByCompletion} filterByUser={filterByUser} 
                                    filterByBucket={filterByBucket} filterByDuration={filterByDuration} domNode={filtersNode}
                                     clearFilters={clearFilters} filters={filters} setFrom={setFrom} setTo={setTo} />
                            </div>
                        </> : <>
                            <label>zoom</label>
                            <input type="range" min="0" max="100" defaultValue="50" onChange={(e=>setZoom(e.target.value))} />
                        </>}
                    </div>
                    <div className="users">
                        <div className="group-members" >
                            <button onClick={()=> showGroupSearch()} className="group-members-btn" >Group mempers ({project.group.length}) 
                                <i class="fas fa-chevron-down"></i>
                            </button>
                            
                        </div>
                        {project.owner._id == userID?<button onClick={()=>setAddUserOpen(true)} className="group" >
                            Add Members<i class="fas fa-user-plus"></i>
                        </button>:null}
                        
                        <GroupSearch  group={project.group} projectID={project._id} type="show"
                         domNode={domNode} position={"group-search-container"} />
                        
                    </div>
                    
                </div>
            </div>
            <div className="proj-body" >
                {view==="grid"?
                    <Grid  tasks={tasks} project={project}/>:view==="board"?
                    <Board filter={boardfilter} project={project}/>:
                    <Timline project={project} zoom={zoom}/>
                }
            </div>
        </div>:null}

        <AddUsers isOpen={addUserOpen} close={()=>setAddUserOpen(false)} project={project} />
        <svg className="draw" ></svg>
   </>
}

export default ProjectScreen
