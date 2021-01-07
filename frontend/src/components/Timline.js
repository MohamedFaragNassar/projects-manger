import React, {  useState } from 'react'
import {useMutation} from '@apollo/client'
import {updateTaskMutation,getProjectDetailsQuery} from '../queries/projectQueries'
import Node from '../components/Node'
import Bar from '../components/Bar'
import {getDeffrenceInDays,modifyDate,addDays,removeDays} from '../helpers/helpers'


const Timline = (props) => {
    const {project,zoom} = props 
    const [index, setIndex] = useState()
    let cdate
    if(index){
        cdate =modifyDate((Number(project.createdAt)+index*86400000))
     }

    const [updateTask] = useMutation(updateTaskMutation)

    const handleEditEndDate = (id,date,days)=>{
        updateTask({
            variables:{
                id,
                updatedFields:{end:addDays(date,(index-days)).toISOString("YYYY-MM-DD").split('T')[0]}
            },
            refetchQueries:[{query:getProjectDetailsQuery,variables:{id:project._id}}]
        })
        setIndex(null)
    }

    const handleEditStartDate = (id,date,days)=>{
        updateTask({
            variables:{
                id,
                updatedFields:{start:addDays(date,(index-days)).toISOString("YYYY-MM-DD").split('T')[0]}
            },
            refetchQueries:[{query:getProjectDetailsQuery,variables:{id:project._id}}]
        })
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
      
     
    return (
        <div className="timeline">
            <div className="changing-date">{cdate ? cdate:null}</div>
            <div className="timeline-side" ></div>
            <div className="timeline-main">
                {project.tasks.map(task => {
                    const days = getDeffrenceInDays(task.end,task.start)
                    const daysBeforStart =getDeffrenceInDays(task.start,modifyDate(project.createdAt))
                   
                  return ( <div className="timline-task" >
                       <Bar length={days} befor={daysBeforStart} task={task} handleEditEndDate={handleEditEndDate} 
                        handleEditStartDate={handleEditStartDate} /> 
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
    )
}

export default Timline

{/* <svg  width="62" height="600" pointer-events="none" position="absolute" version="1.1" xmlns="http://www.w3.org/2000/svg" >

<path d="M 0 0 L 25 0 A 3 3 0 0,1 28 3 L 28 250  A 3 3 0 0,0 31 253 L 56 253 " transform="translate(3,3)" pointer-events="visibleStroke" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="rgb(132, 172, 179)"  stroke-width="4"></path>

</svg>
<svg  width="62" height="600" pointer-events="none" position="absolute" version="1.1" xmlns="http://www.w3.org/2000/svg" >
    <path d="M 50 0 L 25 0 A 3 3 0 0,0 24 3 L 25 250  A 3 3 0 0,1 24 253 L 0 253 " transform="translate(3,3)" pointer-events="visibleStroke" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="rgb(132, 172, 179)" stroke-width="5"></path>
</svg> */}

/* 
<path d={`M ${box1.x} ${box1.y} L ${box1.x+25} ${box1.y} A 3 3 0 0,1 ${box1.x+28} ${box1.y+3} L ${box1.x+28} ${box1.y+250}  A 3 3 0 0,0 ${box1.x+31} ${box1.y+253} L ${box1.x+56} ${box1.y+253} `}
             transform="translate(3,3)" pointer-events="visibleStroke" version="1.1" xmlns="http://www.w3.org/2000/svg" 
             fill="none" stroke="rgb(132, 172, 179)"   stroke-width="4"></path> */