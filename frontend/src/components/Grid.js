import React, { useEffect, useState } from 'react'
import {useMutation} from '@apollo/client'
import {hideAndShow} from '../helpers/helpers'
import {addTaskMutation,getProjectDetailsQuery,updateTaskMutation} from '../queries/projectQueries'
import AddTask from '../components/AddTask'
import {useClickToClose} from '../helpers/CTC'
import {getDragAfterElement} from '../helpers/dragAndDrop'



const Grid = (props) => {
    const userData = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null 
    let userID 
    if(userData){
        userID = userData.login.id
    }
    const storedColumns  =localStorage.getItem("columns") ? JSON.parse(localStorage.getItem("columns"))  : []
    const {project,tasks} = props;
    const [columns,setColumns] = useState(storedColumns)
    const options = ["bucket","start","end", "dependsOn","dependants"].filter(opt => {return !columns.includes(opt) })
    const [task,setTask] = useState()
    const [isOpen,setIsOpen] = useState(false)
    
    const [finishTask] = useMutation(updateTaskMutation)
    const [addNewTask] = useMutation(addTaskMutation)

    const domNode = useClickToClose(()=>setIsOpen(false),".add-task")
    const addTaskNode = useClickToClose(()=> hideAndShow("add-task-form","add-new-task"),"#add-task-form")
    const handleFinishTask = (id)=>{
        finishTask({variables:{
            id,
            updatedFields:{completion:100}
        },
        refetchQueries:[{query:getProjectDetailsQuery,variables:{
            id:project._id
        }}]})
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


    const handleHideColumn = (e,col)=>{
        const filteredCols = columns.filter(column => {return column != col })
        setColumns(filteredCols)
        localStorage.setItem("columns",JSON.stringify([...filteredCols]))
    }

    const showDel = (e)=>{
        const icon = e.target.firstElementChild
        if(icon){
            icon.classList.remove("hide")
        }
    }
   
    const hideDel = (e)=>{
        const icon = e.target.firstElementChild
        if(icon){
            icon.classList.add("hide")
        }
    }

    const handleShowTaskForm = () =>{
        hideAndShow("add-new-task","add-task-form")
    }

    const handleAddTask = (e) =>{
        e.preventDefault()

        addNewTask({variables:{
            id:project._id,
            taskName:task
        },
        refetchQueries:[{query:getProjectDetailsQuery,variables:{
            id:project._id
        }}]
    })

        hideAndShow("add-task-form","add-new-task")
    }

console.log(userData)

    const handleTaskDetails = (id)=>{
        setTask( id)
        setIsOpen(true)
    }

    
    console.log(tasks)

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


    useEffect(()=>{
        

    },[columns])
  
    return <>
        <div ref={domNode} className="add-task-panel" >
            <AddTask method="add" isOpen ={isOpen} close={()=>setIsOpen(false)} task={task} project={project} />
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
                    {col} 
                    <i onClick={(e)=>handleHideColumn(e,col)} className="fal fa-times-circle"></i>
                </span>    
                )}
                {options.length > 0 ?<div ref={addColNode} className="add-col-container">
                    <select id="select-col" className="hide">{options.map( opt =>
                    <option onClick={(e)=>handleAddColumn(e.target.value)}>{opt}</option>    
                    )}</select>
                    <button id="add-col" onClick={()=>handleShowSelect()}>Add column</button>
                </div> : null}
            </div>
            <div onDragOver={(e)=>handledragOver(e)} id="table-body">
                {tasks&&tasks.map(task => 
                    <div key={task._id} draggable={true} className="task-row draggable" onDragStart={(e)=>handleDrageStart(e)} >
                        <span className="finish-icon" >{userID&&userID==project.owner._id?<button onClick={()=>handleFinishTask(task._id)} 
                        className="check">{task.completion < 100 ?<i className="far fa-circle"></i>:
                        <i className="fas fa-check-circle"></i>}</button>:null}</span>
                            <span className="task-name" >
                                <section>{task.name}</section>
                                <i onClick={()=>handleTaskDetails(task._id)} id="task-details-icon" className="fal fa-info-circle"></i>
                            </span>
                            <span>{task.assignedTo.map(user =>
                                <span>{user.userName}</span>
                                )}</span>
                            <span>{task.duration}</span>
                            <span>{task.completion} %</span>
                            {columns && columns.map(col => 
                            col ==="dependsOn" || col ==="dependants"? 
                            <span>{task[col].map(task => 
                                    <span>{task.name}</span>
                                )}</span>
                            : <span>{task[col]}</span>    
                        )}
                        <span></span>
                    </div>
                )}
            </div>
            {userID&&userID==project.owner._id?<div className="add-task-wrapper">
                    <div ref={addTaskNode} id="add-new-task">
                        <i class="fas fa-plus"></i>
                        <button onClick={()=>handleShowTaskForm()} >Add new task</button>
                    </div>
                    <form onSubmit={(e)=>handleAddTask(e)} id="add-task-form" className="hide task-form " >
                        <input onChange={(e)=>setTask(e.target.value)} required={true} type="text" />
                        <button><i className="fas fa-plus-circle"></i></button>
                    </form>
            </div>:null}
        </div>
        
    </>
}

export default Grid
