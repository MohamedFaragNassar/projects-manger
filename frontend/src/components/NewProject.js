import React, { useState } from 'react'
import {useMutation} from '@apollo/client'
import {addProjectMutation,getProjectsQuery} from '../queries/projectQueries'

const NewProject = (props) => {

    const [name,setName] = useState("")
    const [buckets,setBuckets] = useState([])
    const [bucket,setBucket] = useState(null)

    const [addProject] = useMutation(addProjectMutation)
    
    
    const handleAddBuckets = (e)=>{
        e.preventDefault()
        if(bucket){
            setBuckets([...buckets,bucket])
        }
        setBucket(null)
    }
  
    const handleDelBucket = (e) =>{
        e.preventDefault()
        const bucket = e.target.previousElementSibling.innerText
        setBuckets(buckets.filter(x => x != bucket))
    }

    const handelAddProject = (e) => {
        e.preventDefault()
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
                        <form className="add-stages">
                           <input  onChange={(e)=>setBucket(e.target.value)} type="text" required={true} />
                           <button onClick={(e)=>handleAddBuckets(e)} >+</button> 
                        </form>
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
