import React, { useEffect, useState } from 'react'

const Status = ({status,message,close}) => {
    return <>
        <div id="status">
            <span className={`status-${status}`}><i class="fas fa-times-circle"></i> </span>
            <span className="status-message">{message}</span>
            <button onClick={close} ><i class="fas fa-times-circle"></i></button>
        </div>
    </>
    
}

export default Status;
