import React, {useState} from 'react'

const Filters = (props) => {
    
    const {project,filterByBucket,filterByCompletion,filterByDuration
            ,filterByUser,clearFilters,filters,setFrom,setTo} = props
    const [filter,setFilter] = useState()
    const appliedFilters = filters.map(filt => filt.filter)
    const options = ["Bucket","Completion","Duration","Group member"].filter(item => {return !appliedFilters.includes(item)})
    
    return (
        <div ref={props.domNode} className="filters-panel hide-v">
        <div className="filters-body" >
            <div className="filter-options">
                <label>Filter by</label>
                <select id="filter-select" onChange={(e)=>setFilter(e.target.value)} >
                    <option value={null} >-</option>
                    {options.map(opt => 
                        <option>{opt}</option>    
                    )}
                </select>
            </div>
                {filter==="Bucket" ? 
                    <select onChange={(e)=> filterByBucket(e.target.value)} >
                        <option value={null} >-</option>
                        {project.buckets.map(bucket => 
                            <option>{bucket}</option>
                        )}
                    </select>  :
                    filter === "Completion" ?
                    <div>
                        <section>
                            <label>from</label>
                            <input type="number" min={0} max={100} onChange={(e)=>setFrom(e.target.value)} />
                        </section>
                        <section>
                             <label>to</label>
                            <input type="number" min={1} max={100} onChange={(e)=>setTo(e.target.value)} />
                        </section>
                       
                        <button onClick={()=>filterByCompletion()} >
                            Add
                        </button>
                    </div>  :
                    filter === "Duration" ?
                    <div>
                        <section>
                            <label>from</label>
                            <input type="number" min={0} onChange={(e)=>setFrom(e.target.value)} />
                        </section>
                        <section>
                            <label>to</label>
                            <input type="number" min={1} onChange={(e)=>setTo(e.target.value)} />
                        </section>
                        <button  onClick={()=>filterByDuration()} >Add</button>
                    </div>  :
                    filter === "Group member" ?
                    <select >
                        {project.group.map(user => 
                            <option onClickCapture={(e)=>filterByUser(e.target)} value={user._id} name={user.userName}>
                                {user.userName}
                            </option>
                        )}
                    </select>
                    :null}
                <div>
                    {filters.length > 0 ? <>
                        {filters.map(filt => 
                            <div className="applied-filter">
                                <span className="added-filter" >{filt.filter}</span>
                                <span>{filt.value}</span>
                            </div>    
                        )}
                    <button onClick={()=> clearFilters()} >Clear Filters</button>
                    </>
                    :null}
                </div>
                    
        </div>
    </div>
    )
}

export default Filters
