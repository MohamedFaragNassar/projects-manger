import React from 'react'
import {useClickToClose} from '../helpers/CTC'
import {hideOrShow} from '../helpers/helpers'
import ShowDependacy from '../components/ShowDependacy'

const AdditionalColumns = ({columns,task}) => {

    const handleShowDependacy = (e)=>{
           
        hideOrShow(e.target,"dependacy-container","show")
    }

    const hideShowDependacy = ()=>{
        const container = document.querySelector(".grid-dependacy-container:not(.hide)")
        if(container){
            container.classList.add("hide")
        }
    }
    const dependacynode = useClickToClose(hideShowDependacy,".grid-dependacy-container:not(.hide)")

    
    return <>
        {columns && columns.map((col,index) => 
            col ==="dependsOn" || col ==="dependants"? 
            <div key={index} className="dependacy-row">
                {col==="dependsOn"&&task.dependsOn.length >0 ?<button className="dependacy-btn"
                 onClick={(e)=>handleShowDependacy(e)}>
                    ({task.dependsOn.length}) tasks
                    <div ref={dependacynode} id="dependacy-container" className="grid-dependacy-container hide">
                        {task.dependsOn.map(item => 
                            <ShowDependacy key={item._id} id={task._id} task={item} field="dependsOn"/>    
                        )}
                    </div>
                </button> :null}
                {col==="dependants"&&task.dependants.length >0 ?<button className="dependacy-btn"  
                onClick={(e)=>handleShowDependacy(e)}>
                    ({task.dependants.length}) tasks
                    <div ref={dependacynode} id="dependacy-container" className="grid-dependacy-container hide">
                    {task.dependants.map(item => 
                        <ShowDependacy key={item._id} id={task._id} task={item} field="dependants"/>    
                    )}
                </div>
                </button>:null}
            </div>
            : <span key={index} >{task[col]}</span>    
        )}
    </>
}

export default AdditionalColumns
