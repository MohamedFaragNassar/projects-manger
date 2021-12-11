import React, { useEffect, useState } from 'react'
import {useMutation} from '@apollo/client'
import {hideAndShow} from '../helpers/helpers'
import {addTaskMutation,getProjectDetailsQuery,updateTaskMutation} from '../queries/projectQueries'
import AddTask from '../components/AddTask'
import {useClickToClose} from '../helpers/CTC'
import {getDragAfterElement} from '../helpers/dragAndDrop'
import TaskMenu from '../components/TaskMenu'
import {hideOrShow} from '../helpers/helpers'
import AdditionalColumns from './AdditionalColumns'
import {getDuration} from '../helpers/helpers'
import ShowAssghnedTo from '../components/ShowAssghnedTo'
import Assigh from '../components/Assigh'


const Grid = ({project,tasks,errorHandler}) => {
    
    const userData = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null 
    let userID = userData?.id
    const isAllowed = project?.owner?._id === userID

    const storedColumns  =localStorage.getItem("columns") ? JSON.parse(localStorage.getItem("columns"))  : []
    const [columns,setColumns] = useState(storedColumns)
    const options = ["bucket","start","end", "dependsOn","dependants"].filter(opt => {return !columns.includes(opt) })
    const [task,setTask] = useState()
    const [isOpen,setIsOpen] = useState(false)
    
    const [finishTask] = useMutation(updateTaskMutation)
    const [addNewTask] = useMutation(addTaskMutation)

    const domNode = useClickToClose(()=>setIsOpen(false),".add-task")
    const addTaskNode = useClickToClose(()=> hideAndShow("add-task-form","add-new-task"),"#add-task-form")
    
    const handleFinishTask = async(id)=>{
       try{
            await finishTask({variables:{
                id,
                updatedFields:{completion:100}
            },
            refetchQueries:[{query:getProjectDetailsQuery,variables:{
                id:project._id
            }}]})
       }catch(err){
           errorHandler(err.message)
       }
        hideMenu()

    }

    const handleShowSelect = ()=>{
        hideAndShow("add-col","select-col")
    }
    
    const handleAddColumn = (col) => {
        setColumns([...columns,col])
        localStorage.setItem("columns",JSON.stringify([...storedColumns,col]))
        hideAndShow("select-col","add-col")
    }

    const addColNode = useClickToClose(()=>hideAndShow("select-col","add-col"),"#select-col")

    const hideMenu = ()=>{
        const menu = document.querySelector(".task-menu:not(.hide)")
        if(menu){
            menu.classList.add("hide")
        }
    }
 
    const taskMenuNode = useClickToClose(hideMenu,".task-menu:not(.hide)")

    const handleHideColumn = (e,col)=>{
        const filteredCols = columns.filter(column => {return column != col })
        setColumns(filteredCols)
        localStorage.setItem("columns",JSON.stringify([...filteredCols]))
    }

    const handleShowTaskForm = () =>{
        hideAndShow("add-new-task","add-task-form")
        document.getElementById("task-input").focus()
      

    }

    const handleAddTask = async(e) =>{
        e.preventDefault()

        try{
            await addNewTask({variables:{
                id:project._id,
                taskName:task
            },
                refetchQueries:[{query:getProjectDetailsQuery,variables:{
                    id:project._id
                }}]
            })
        }catch(err){
            errorHandler(err.message)
        }
        document.getElementById("add-task-form").reset()
        hideAndShow("add-task-form","add-new-task")
    }

    const handleTaskDetails = (id)=>{
        setTask( id)
        setIsOpen(true)
        hideMenu()
    }

    
    const handleDrageStart = (e)=>{
        e.target.classList.add("dragging")
    }

    const handledragOver = (e,bucket)=>{
        const container = document.getElementById("table-body")
        e.preventDefault()
        const afterElement = getDragAfterElement(container, e.clientY)
        const draggingElemnet = document.querySelector('.dragging')
        
        draggingElemnet.addEventListener("dragend",()=>{
            if(!afterElement){
                container.appendChild(draggingElemnet)
            }else{
                container.insertBefore(draggingElemnet,afterElement)
            }
            draggingElemnet.classList.remove("dragging")
        })
    }

    const handleShowMenu = (e) => {
        hideOrShow(e.target.offsetParent,"task-menu","show")
    }

    
    
    useEffect(()=>{
        
    },[columns])
  
    return <>
        <div className="add-task-panel" >
            <AddTask method="add" isOpen ={isOpen} close={()=>setIsOpen(false)}
             task={task} project={project} domNode={domNode} errorHandler={errorHandler} />
        </div>
        <div className="grid-main" >
            <div className="grid-header">
                <span className="finish-icon" >-</span>
                <span className="task-name">Name</span>
                <span>Assign to </span>
                <span>Duration </span>
                <span>completed</span>
                {columns && columns.map(col => 
                <span className="additional-col" key={col} >
                    {col} <i onClick={(e)=>handleHideColumn(e,col)} className="fal fa-times-circle"></i>
                 </span>    
                )}
                {options.length > 0 ?<div  className="add-col-container">
                    <select ref={addColNode} id="select-col" className="hide">{options.map( (opt,indx) =>
                    <option key={indx} onClick={(e)=>handleAddColumn(e.target.value)}>{opt}</option>    
                    )}</select>
                    <button id="add-col" onClick={()=>handleShowSelect()}>Add column</button>
                </div> : null}
            </div>
            <div onDragOver={(e)=>handledragOver(e)} id="table-body">
                {tasks&&tasks.map(task => 
                    <div key={task._id} draggable={true} className="task-row draggable" onDragStart={(e)=>handleDrageStart(e)} >
                        <span className="finish-icon" >{userID&&userID==project.owner._id?
                        <button onClick={()=>handleFinishTask(task._id)} 
                        className="check">{task.completion < 100 ?<i className="far fa-circle"></i>:
                        <i className="fas fa-check-circle completed"></i>}</button>:null}</span>
                            <span className="task-name" >
                               <section style={task.completion===100?{textDecoration:"line-through"}:null} >{task.name}</section>
                                <div className="task-icons">
                                    <i onClick={()=>handleTaskDetails(task._id)} id="task-details-icon"
                                         className="fal fa-info-circle"></i>
                                    {isAllowed ? <>  
                                        <i  onClick={(e)=>handleShowMenu(e)}  className="far fa-ellipsis-v"></i>
                                        <TaskMenu task={task} handleFinishTask={handleFinishTask} 
                                        close={()=>hideMenu()}  domNode={taskMenuNode} errorHandler={errorHandler}
                                        handleTaskDetails={handleTaskDetails} projectID={project._id} /> 
                                    </> : null} 
                                </div>
                            </span>
                            <div  className="dependacy-row">
                                <Assigh users={task.assignedTo} taskID={task._id} 
                                projectID={project._id} type="grid" isAllowed={isAllowed}/>
                            </div>
                            <span>{task.start&&task.end ? getDuration(task.start,task.end):null}</span>
                            <span>{task.completion} %</span>
                            <AdditionalColumns columns={columns} task={task} />
                        {columns.length<5?<span></span>:null}
                    </div>
                )}
            </div>
            {isAllowed&&<div className="add-task-wrapper">
                    <div id="add-new-task">
                        <i className="fas fa-plus"></i>
                        <button onClick={()=>handleShowTaskForm()} >Add new task</button>
                    </div>
                    <form ref={addTaskNode} onSubmit={(e)=>handleAddTask(e)} id="add-task-form" className="hide task-form " >
                        <input id="task-input" onChange={(e)=>setTask(e.target.value)} required={true} type="text" />
                        <button><i className="fas fa-plus-circle"></i></button>
                    </form>
            </div>}
        </div>
        
    </>
}

export default Grid
