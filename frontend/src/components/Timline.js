import React, {  useState } from 'react'
import {useMutation} from '@apollo/client'
import {editEndDateMutation,getProjectDetailsQuery,editStartDateMutation} from '../queries/projectQueries'
import Node from '../components/Node'
import Bar from '../components/Bar'
import {getDeffrenceInDays,modifyDate,addDays,removeDays} from '../helpers/helpers'
import Status from '../components/Status'

const Timline = (props) => {
    const {project,zoom} = props 
    const [index, setIndex] = useState()
    const [error, setError] = useState()
    

    let cdate
    if(index){
        cdate =modifyDate((Number(project.createdAt)+index*86400000))
     }

    const [editStart] = useMutation(editStartDateMutation)
    const [editEnd] = useMutation(editEndDateMutation)

    const handleEditEndDate = (id,date,days)=>{
        editEnd({
            variables:{
                id,
                date:addDays(date,(index-days)).toISOString("YYYY-MM-DD").split('T')[0]
            },
            refetchQueries:[{query:getProjectDetailsQuery,variables:{id:project._id}}]
        })
        setIndex(null)
        
    }

    const handleEditStartDate = (id,date,days)=>{
        
        editStart({
                variables:{
                    id,
                    date:addDays(date,(index-days)).toISOString("YYYY-MM-DD").split('T')[0]
                },
                refetchQueries:[{query:getProjectDetailsQuery,variables:{id:project._id}}]
            })
            .then(res => console.log(res))
            .catch(err => setError(err) )
            
      
        setIndex(null)
        


    }

    const getInitialGrid = () => {
        const grid = [];
        for (let col = 0; col < 53; col++) {
            grid.push(col);
          }
        
        return grid;
      };
      const grid = getInitialGrid()
      
      
     
    return <>
        {error&& <Status status="success" message={error.message} close={()=>setError(null)} />}
        <div className="timeline">
            <div className="changing-date">{cdate ? cdate:null}</div>
            <div className="timeline-side" >
                {project.tasks.map(task => 
                    <div className="timline-side-task">{task.name}</div>    
                )}
            </div>
            <div className="timeline-main">
                {project.tasks.map(task => {
                    const days = getDeffrenceInDays(task.end,task.start)
                    const daysBeforStart =getDeffrenceInDays(task.start,modifyDate(project.createdAt))
                   
                  return ( <div className="timline-task" >
                       <Bar length={days} befor={daysBeforStart} task={task} handleEditEndDate={handleEditEndDate} 
                        handleEditStartDate={handleEditStartDate} index={index} /> 
                        <div className="row-grid">
                            {grid.map(x => 
                                <Node index = {x+1} setIndex={setIndex} />    
                            )}
                        </div>
                   </div>) 
                }
                )}
            </div>
            
        </div>
    </>
}

export default Timline

