import React, { useState } from 'react'
import {useMutation} from '@apollo/client'
import {updateTaskMutation,getProjectDetailsQuery
        ,addDependaciesForTaskMutation} from '../queries/projectQueries'
import {debounce} from '../helpers/helpers'
import GroupSearch from '../components/GroupSearch'
import ShowDependacy from '../components/ShowDependacy'

const AddTask = (props) => {
    const userData = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null 
    let userID 
    if(userData){
        userID = userData.login.id
    }

    const project = props.project
    const taskID = props.task
    const task =project.tasks.find(item => {return item._id == taskID})
    
    const node = props.domNode
    let isAllowed
   
if(task){
    if(project.owner._id == userID || task.assignedTo.some(user => user._id == userID) ){
        isAllowed = true
    }
}

   
    

    const [isOpen,setIsOpen] = useState(false)
    
    

    const [updateTask] = useMutation(updateTaskMutation)
    const [addDependacy] = useMutation(addDependaciesForTaskMutation)



    const updateTaskHandler = debounce((item)=>{
        updateTask({variables:{
            id:task._id,
            updatedFields: item,
        },
        refetchQueries:[{query:getProjectDetailsQuery,variables:{
            id:project._id
        }}]})
    },2000)

    const addDependacyHandler = (taskID,field) => {
        addDependacy({
            variables:{
                id:task._id,
                taskID,
                field
            },
            refetchQueries:[{query:getProjectDetailsQuery,variables:{
                id:project._id
            }}]
        })
    }

    
    


    if(!props.isOpen){
        return null
    }
    return <>
        <div ref={node}  className="add-task">
            <div className="single assign-users">
                <div className="group-search-panel" >
                    <GroupSearch isOpen={isOpen} users={project.group} taskID = {task._id} projectID ={project._id} />
                </div>
                <button onClick={()=>setIsOpen(true)}><i class="fas fa-user-plus"></i></button>
                <ul>
                    {task.assignedTo.map(user => 
                        <li>{user.userName}</li>
                    )}
                </ul>
            </div>
            <div className="single">
                <label>Name</label>
                <input onChange={(e)=>updateTaskHandler({name:e.target.value})} defaultValue={task.name} readOnly={!isAllowed} type="text"/>
            </div>
            <div  className="double">
                <div>
                    <label>Start</label>
                    <input onChange={(e)=>updateTaskHandler({start:e.target.value})} readOnly={!isAllowed} defaultValue={task.start}  type="date"/>
                </div>
                <div>
                    <label>End</label>
                    <input onChange={(e)=>updateTaskHandler({end:e.target.value})} readOnly={!isAllowed} defaultValue={task.end}  type="date"/>
                </div>
            </div>
            <div className="double" >
                <div>
                    <label>duration</label>
                    <input onChange={(e)=>updateTaskHandler({duration:Number(e.target.value)})} readOnly={!isAllowed} defaultValue={task.duration}  type="number"/>
                </div>
                <div>
                    <label>Completed </label>
                    <input onChange={(e)=>updateTaskHandler({completion:Number(e.target.value)})} readOnly={!isAllowed} defaultValue={task.completion}  type="number"/>
                </div>
            </div>
            <div className="single">
                <label>Bucket</label>
                <select disabled={!isAllowed} defaultValue={task.bucket}  >
                    <option value={null} >-</option>
                    {project.buckets.map(bucket => 
                        <option onClickCapture={(e)=>updateTaskHandler({bucket:e.target.value})}>{bucket}</option>
                    )
                }</select>
            </div>
           <div className="trible">
                <div>
                    <label>effort</label>
                    <input  onChange={(e)=>updateTaskHandler({totalEffort:Number(e.target.value)})} readOnly={!isAllowed} defaultValue={task.totalEffort}  type="number"/>
                </div>
                <div>
                    <label>done </label>
                    <input onChange={(e)=>updateTaskHandler({doneEffort:Number(e.target.value)})} readOnly={!isAllowed} defaultValue={task.doneEffort}  type="number"/>
                </div>
                <div>
                    <label>remainning </label>
                    <input  defaultValue={task.totalEffort - task.doneEffort} type="number" readOnly/>
                </div>
            </div>
            <div className="dependacy">
                { isAllowed ? <div className="single" >
                    <label>Depends On</label>
                    <select defaultValue={task.dependsOn[0]}  >{
                        project.tasks.map(task => 
                            <option onClickCapture={(e)=>addDependacyHandler(task._id,"dependsOn")}>
                                {task.name}
                            </option>
                        )    
                    }</select>
                </div> :null }
                <div className="show-dependacy-container" >
                    {task.dependsOn.map(task =>
                        <div>
                           <ShowDependacy task={task} id={taskID} projectID={project._id} field="dependsOn" isAllowed={isAllowed} />
                        </div>    
                    )}
                </div>
               
            </div>
            <div className="dependacy">
                {isAllowed?<div className="single">
                    <label>Dependants</label>
                    <select defaultValue={task.dependants[0]}  >
                    {
                        project.tasks.map(task => 
                            <option onClickCapture={(e)=>addDependacyHandler(task._id,"dependants")} >
                                {task.name}
                            </option>
                        )    
                    }
                    </select>
                </div>:null}
                <div className="show-dependacy-container" >
                    {task.dependants.map(task =>
                        <ShowDependacy task={task} id={taskID} projectID={project._id} field="dependants" isAllowed={isAllowed} />
                    )}
                </div>
                
            </div>
          </div>
   </>
}

export default AddTask
