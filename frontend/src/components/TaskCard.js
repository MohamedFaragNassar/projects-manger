import React from 'react'

const TaskCard = (props) => {
    const task = props.task;
    const handleDrageStart = (e)=>{
        e.target.classList.add("dragging")
    }
    const handleDrageEnd = (e)=>{
        e.target.classList.remove("dragging")

    }

    return (
        <div onDragStart={(e)=>handleDrageStart(e)}  taskID={task._id}  draggable="true" className="task-card draggable ">
            <div className="tc-top">
                <button>check</button>
                <h3>{task.name}</h3>
            </div>
            <div className="tc-mid">
                <span>{task.duration}</span>
                <span>{task.completion} %</span>
            </div>
            <div className="tc-bottom">
                    <div className="date">
                        {task.endDate}
                    </div>
                    <div className="people">
                        {task.assignedTo.map(user => 
                            <span>{user.userName}</span>
                            )}
                    </div>
            </div>
            
        </div>
    )
}

export default TaskCard
