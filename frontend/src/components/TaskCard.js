import React from "react";
import { useMutation } from "@apollo/client";
import {
  getProjectDetailsQuery,
  updateTaskMutation,
} from "../queries/projectQueries";
import { getDuration } from "../helpers/helpers";
import Assigh from "./Assign";

const TaskCard = ({ task, project, errorHandler }) => {
  const [finishTask] = useMutation(updateTaskMutation);

  const userData = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;
  let userID;
  if (userData) {
    userID = userData.id;
  }

  const handleDragStart = (e) => {
    e.target.classList.add("dragging");
  };

  const handleFinishTask = async (id) => {
    try {
      finishTask({
        variables: {
          id,
          updatedFields: { completion: 100 },
        },
        refetchQueries: [
          {
            query: getProjectDetailsQuery,
            variables: {
              id: project._id,
            },
          },
        ],
      });
    } catch (err) {
      errorHandler(err.message);
    }
  };
  const now = Date.now();
  const isOverDue = now > new Date(task.end).getTime();
  return (
    <div
      onDragStart={(e) => handleDragStart(e)}
      taskID={task._id}
      draggable='true'
      className='task-card draggable '
    >
      <div className='tc-top'>
        <span>
          {userID && userID == project.owner._id ? (
            <button
              onClick={() => handleFinishTask(task._id)}
              className='check'
            >
              {task.completion < 100 ? (
                <i className='far fa-circle '></i>
              ) : (
                <i className='fas fa-check-circle completed'></i>
              )}
            </button>
          ) : null}
        </span>
        <h3
          style={
            task.completion === 100 ? { textDecoration: "line-through" } : null
          }
        >
          {task.name}
        </h3>
      </div>
      <div className='tc-mid'>
        <span>
          {task.start && task.end
            ? `${getDuration(task.start, task.end)} days`
            : null}
        </span>
        <span>{task.completion} %</span>
      </div>
      <div className='tc-bottom'>
        {task.end ? (
          <div
            className='date'
            style={{ background: isOverDue ? "#f05454" : "#fff5c0" }}
          >
            {task.end ? <i class='fal fa-calendar-alt'></i> : null}
            {task.end}
          </div>
        ) : null}
        <div className='people'>
          <Assigh
            users={task.assignedTo}
            type='board'
            errorHandler={errorHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
