import React, { useState } from 'react'
import {useMutation} from '@apollo/client'
import {updateTaskMutation,getProjectDetailsQuery
        ,addDependaciesForTaskMutation
        ,editEndDateMutation,editStartDateMutation} from '../queries/projectQueries'
import {debounce} from '../helpers/helpers'
import GroupSearch from '../components/GroupSearch'
import ShowDependacy from '../components/ShowDependacy'
import {modifyDate,removeDays,addDays} from '../helpers/helpers'
import {getDuration} from '../helpers/helpers'
import {useClickToClose} from '../helpers/CTC'
import Assigh from './Assigh'

const AddTask = (props) => {
    const userData = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null 
    let userID = userData?.id
    
    const project = props.project
    const taskID = props.task
    const task =project.tasks.find(item => {return item._id == taskID})
    
    const node = props.domNode
    const  isAllowed = project?.owner?._id == userID || task?.assignedTo?.some(user => user._id == userID)
   
    const isAllowedGeneral =  project?.owner?._id == userID


const hideGroupSearch = ()=>{
    const menu = document.querySelector(".group-search-containerv2")
    menu.classList.add("hide-v")
}

const domNode = useClickToClose(hideGroupSearch,".group-search-containerv2")
    

    
    const projectStart = modifyDate(project.createdAt)

    const [updateTask] = useMutation(updateTaskMutation)
    const [editStart] = useMutation(editStartDateMutation)
    const [editEnd] = useMutation(editEndDateMutation)
    const [addDependacy] = useMutation(addDependaciesForTaskMutation)



    const updateTaskHandler = debounce((item)=>{
      try{
        updateTask({variables:{
            id:task._id,
            updatedFields: item,
        },
        refetchQueries:[{query:getProjectDetailsQuery,variables:{
            id:project._id
        }}]})
      }catch(err){
          console.log(err)
      }
    },2000)
    
    const updateStartDate = date =>{
      try{
        editStart({variables:{
            id:task._id,
            date: date,
        },
        refetchQueries:[{query:getProjectDetailsQuery,variables:{
            id:project._id
        }}]})
      }catch(err){
          console.log(err)
      }
    }
    const updateEndDate = date =>{
      try{
        editEnd({variables:{
            id:task._id,
            date: date,
        },
        refetchQueries:[{query:getProjectDetailsQuery,variables:{
            id:project._id
        }}]})
      }catch(err){
          console.log(err)
      }
    }

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

    
    const showGroupSearch = (e)=>{
        const menu = e.target.offsetParent.querySelector("#group-search")
        menu.classList.remove("hide-v")
    }

  const filterGroup = (array,filter) =>{
     return array.filter((el) => {
        return !filter.some((f) => {
             return f._id === el._id;
             });
        });
    }
  
 

    if(!props.isOpen){
        return null
    }
    return <>
        <div ref={node}  className="add-task">
           {isAllowedGeneral && <div className="single assign-users">
                <button onClick={(e)=>showGroupSearch(e)}><i className="fas fa-user-plus"></i></button>
               <div style={{position:"relative"}}>
                    <Assigh users={task.assignedTo} taskID={taskID} projectID={project._id} type="grid" />
               </div>
                <GroupSearch group={filterGroup(project.group,task.assignedTo)} type="add" 
                 position={"group-search-containerv2"} domNode={domNode} taskID={taskID} projectID={project._id} />
                
            </div>}
            <div className="single">
                <label>Name</label>
                <input onChange={(e)=>updateTaskHandler({name:e.target.value})} defaultValue={task.name} readOnly={!isAllowed} type="text"/>
            </div>
            <div  className="double">
                <div>
                    <label>Start</label>
                    <input min={projectStart} max={task.end?removeDays(task.end,1).toISOString().split('T')[0]:null}
                    onChange={(e)=>updateStartDate(e.target.value)} readOnly={!isAllowed} defaultValue={task.start} 
                     type="date"/>
                </div>
                <div>
                    <label>End</label>
                    <input min={task.start?addDays(task.start,1).toISOString().split('T')[0]:null}
                    onChange={(e)=>updateEndDate(e.target.value)} readOnly={!isAllowed} defaultValue={task.end} 
                     type="date"/>
                </div>
            </div>
            <div className="double" >
                <div>
                    <label>duration</label>
                    <input onChange={(e)=>updateTaskHandler({duration:Number(e.target.value)})} 
                    readOnly={true} defaultValue={task.duration} 
                    defaultValue={task.start&&task.end ? getDuration(task.start,task.end):null}  type="number"/>
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
                       <ShowDependacy task={task} id={taskID} projectID={project._id} field="dependsOn" isAllowed={isAllowed} />
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
                        <ShowDependacy task={task} id={taskID} projectID={project._id} field="dependants" isAllowed={isAllowed}/>
                    )}
                </div>
                
            </div>
          </div>
   </>
}

export default AddTask
