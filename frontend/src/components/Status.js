import React from "react";

const Status = ({ status, message, close }) => {
  return (
    <>
      <div id='status'>
        <div>
          <span className={`status-${status}`}>
            <i class='fas fa-times-circle'></i>{" "}
          </span>
          <span className='status-message'>{message}</span>
        </div>
        <button onClick={close} type='button'>
          <i class='fas fa-times-circle'></i>
        </button>
      </div>
    </>
  );
};

export default Status;
