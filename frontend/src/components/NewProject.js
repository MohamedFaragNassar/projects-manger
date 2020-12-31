import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
//import {addProject} from '../Actions/projectActions'
import {useMutation} from '@apollo/client'
import {addProjectMutation,getProjectsQuery} from '../queries/projectQueries'

const NewProject = (props) => {

    const dispatch = useDispatch()

    const [name,setName] = useState("")
    const [stages,setStages] = useState([])
    const [buckets,setBuckets] = useState([])
    const [stage,setStage] = useState(null)
    const [bucket,setBucket] = useState(null)

    const [addProject] = useMutation(addProjectMutation)
    
    
    const handleAddStages = (e)=>{
        e.preventDefault()
        if(stage){
            setStages([...stages,stage])
        }
        setStage(null)
        
    }

    const handleAddBuckets = (e)=>{
        e.preventDefault()
        setBuckets([...buckets,bucket])
        setBucket("")
    }
    const handleDelStage = (e) =>{
        e.preventDefault()
        const stage = e.target.previousElementSibling.innerText
        setStages(stages.filter(x => x != stage))
    }
    const handleDelBucket = (e) =>{
        e.preventDefault()
        const bucket = e.target.previousElementSibling.innerText
        setBuckets(buckets.filter(x => x != bucket))
    }

    const handelAddProject = (e) => {
        e.preventDefault()
        let fullStages = []
        for(let i=0; i<stages.length;i++){
            fullStages.push({
                order: i+1,
                name: stages[i]
            })
        }
        addProject({
            variables:{
                name,
                buckets
            },
            refetchQueries:[{query:getProjectsQuery}]
        })

        const close = props.close
        close();
    }

    if(!props.isOpen){
        return null
    }
    return <>
        <div className="overlay"></div>
        <div className="new-project">
            <h3>Making New Project</h3>
            <form>
                <div className="project-name">
                    <label>Name</label>
                    <input onChange={(e)=>setName(e.target.value)} type="text" required={true}/>
                </div>
                <div className="buckets stages" >
                    <div>
                        <label>Buckets</label>
                        <div className="list-buckets">
                        {buckets.map(bucket => 
                            <div>
                                <div>{bucket}</div>
                                <button onClick={(e)=>handleDelBucket(e)} >-</button>
                               
                            </div>
                             )} 
                        </div>
                        <div className="add-stages">
                           <input  onChange={(e)=>setBucket(e.target.value)} type="text" />
                           <button onClick={(e)=>handleAddBuckets(e)} >+</button> 
                        </div>
                    </div>
                </div>
                <div className="add-project-btns" >
                    <button onClick={(e)=>handelAddProject(e)} className="confirm" >Add Project</button>
                    <button onClick={props.close} className="cancel">Cancel</button>
                </div>
            </form>
        </div>
    </>
}

export default NewProject
