import React from 'react'

const Node = ({index,setIndex}) => {

    return (
       <div index={index} className="node" onDragOver={(e)=>setIndex(e.target.attributes.index.value)}
         ></div>
    )
}

export default Node
