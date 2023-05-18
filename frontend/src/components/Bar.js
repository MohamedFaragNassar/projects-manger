import React from "react";
import Relation from "../components/Relation";

const Bar = ({
  befor,
  length,
  task,
  handleEditEndDate,
  handleEditStartDate,
  index,
  nodeSize,
  trigger,
}) => {
  return (
    <div
      style={{
        width: length * nodeSize + "px",
        marginLeft: befor * nodeSize + "px",
      }}
      id={`${task._id}`}
      className='bar'
    >
      <button
        draggable='true'
        className='bar-btn'
        onDragEnd={() => handleEditStartDate(task._id, task.start, befor)}
      >
        <i id='start' className='far fa-scrubber'></i>
      </button>
      <button
        draggable='true'
        className='bar-btn'
        onDragEnd={() => handleEditEndDate(task._id, task.end, befor + length)}
      >
        <i id='end' className='far fa-scrubber'></i>
      </button>
      <div
        style={{ width: task.completion + "%" }}
        className='compeletion-state'
      ></div>
      {task.dependants.length > 0 &&
        task.dependants.map((relTask) => (
          <Relation
            key={task._id}
            id1={task._id}
            id2={relTask._id}
            left={(length / 2) * nodeSize}
            index={index}
          />
        ))}
    </div>
  );
};

export default Bar;
