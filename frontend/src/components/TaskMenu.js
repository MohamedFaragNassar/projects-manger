import React from "react";
import { useMutation } from "@apollo/client";
import {
  deleteTaskMutation,
  getProjectDetailsQuery,
} from "../queries/projectQueries";
const TaskMenu = ({
  task,
  handleTaskDetails,
  handleFinishTask,
  projectID,
  domNode,
  close,
  errorHandler,
}) => {
  const [deleteTask] = useMutation(deleteTaskMutation);

  const handleDelTask = async () => {
    try {
      await deleteTask({
        variables: {
          id: task._id,
        },
        refetchQueries: [
          { query: getProjectDetailsQuery, variables: { id: projectID } },
        ],
      });
    } catch (err) {
      errorHandler(err.message);
    }

    close();
  };

  return (
    <div ref={domNode} id='task-menu' className='task-menu hide'>
      <button onClick={() => handleTaskDetails(task._id)}>
        <i id='task-details-icon' className='fal fa-info-circle'></i>
        <span className='task-menu-item'>Details</span>
      </button>
      <button onClick={() => handleDelTask()}>
        <i className='fas fa-trash-alt'></i>
        <span className='task-menu-item'>Delete Task</span>
      </button>
      {task.completion < 100 ? (
        <button onClick={() => handleFinishTask(task._id)} className='check'>
          <i className='far fa-circle'></i>
          <span className='task-menu-item'>Complete Task</span>
        </button>
      ) : null}
    </div>
  );
};

export default TaskMenu;
