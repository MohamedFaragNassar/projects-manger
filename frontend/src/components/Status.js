import React, { useEffect, useState } from 'react'

const Status = (props) => {
    return <>
        <div id="status">
            <span className={`status-${props.status}`}><i class="fas fa-times-circle"></i> </span>
            <span className="status-message">{props.message}</span>
        </div>
    </>
    
}

export default Status;
