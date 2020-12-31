import React, { useEffect, useState } from 'react'

const Relation = ({id1,id2,left}) => {

    const colors = ['#16c79a', '#19456b', '#11698e','#e7d9ea', '#583d72', '#fa9579','#fdb827', '#bedbbb', '#839b97'];
    const random_color = colors[Math.floor(Math.random() * colors.length)];
    
    const [x1,setX1] = useState()
    const [y1,sety1] = useState()
   
    let box1 , box2 
    
    useEffect(() => {
        const element1 = document.getElementById(id1)
        const element2 = document.getElementById(id2)
       if(element1,element2){

           box1 = element1.getBoundingClientRect()
           box2 = element2.getBoundingClientRect()
           sety1(box2.y-box1.y)
           setX1(box2.x-(box1.x+box1.width))
           console.log(box2.left)
           console.log(box1.left)
       }
        
    }, [x1])
        
    console.log(y1)
    return <>
        {y1 > 0 ?
        <svg className="draw" style={{left:left+"px"}} >
            <polyline points={`0,0 25,0 25,${y1} ${x1},${y1}`} fill="none" strokeWidth="4" stroke={random_color} />
        </svg>
        :
        <svg className="drawv2" style={{left:left+"px"}} >
            <polyline points={`0,600 25,600 25,${600+y1} ${x1},${600+y1}`} fill="none" strokeWidth="4" stroke={random_color} />
        </svg>
        }
    </>
}

export default Relation

{/* <div className="timeline">
            <div className="changing-date">{cdate ? cdate:null}</div>
            <div className="timeline-side" ></div>
            <div className="timeline-main">
                {project.tasks.map(task => {
                    const days = getDeffrenceInDays(task.end,task.start)
                    const daysBeforStart =getDeffrenceInDays(task.start,modifyDate(project.createdAt))
                   
                  return ( <div className="timline-task"  >
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
} */}


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