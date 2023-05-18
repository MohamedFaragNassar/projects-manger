import React, { useState } from "react";
import TaskCard from "./TaskCard";
import { useMutation } from "@apollo/client";
import {
  addBucketMutation,
  addTaskToBucketMutation,
  getProjectDetailsQuery,
  deleteBucketmutation,
} from "../queries/projectQueries";
import { getDragAfterElement } from "../helpers/dragAndDrop";
import { useClickToClose } from "../helpers/CTC";

const Board = ({ filter, project, errorHandler }) => {
  const userData = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;
  let userID;
  if (userData) {
    userID = userData.id;
  }

  const [bucket, setBucket] = useState();
  const [showForm, setShowForm] = useState(false);

  const [addBucket] = useMutation(addBucketMutation);
  const [addTaskToBucket] = useMutation(addTaskToBucketMutation);
  const [deleteBucket] = useMutation(deleteBucketmutation);

  const handleAddBucket = async (e) => {
    e.preventDefault();

    try {
      await addBucket({
        variables: {
          id: project._id,
          bucket,
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

    const bucketInput = document.querySelector("#bucket-input");
    bucketInput.value = null;
    bucketInput.classList.add("hide");
    setShowForm(false);
  };

  const showInput = () => {
    setShowForm(true);
  };

  const bucketNode = useClickToClose(
    () => setShowForm(false),
    "#add-bucket-form"
  );

  const showSelect = (e) => {
    const selectTask = e.target.previousElementSibling;
    selectTask.classList.remove("hide");
    e.target.classList.add("hide");
  };

  const handleAddTaskToBucket = async (e) => {
    const taskID = e.target.value;
    const bucket = e.target.attributes.bucket.value;
    const select = e.target.parentElement;
    const btn = select.nextElementSibling;

    try {
      await addTaskToBucket({
        variables: {
          projectID: project._id,
          taskID,
          bucket,
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

    select.classList.add("hide");
    btn.classList.remove("hide");
  };

  const handleDragOver = (e, bucket) => {
    const container = document.getElementById(bucket);
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggingElemnet = document.querySelector(".dragging");
    const taskID = draggingElemnet.attributes.taskID.value;

    draggingElemnet.addEventListener("dragend", () => {
      if (!afterElement) {
        container.appendChild(draggingElemnet);
      } else {
        container.insertBefore(draggingElemnet, afterElement);
      }
      addTaskToBucket({
        variables: {
          projectID: project._id,
          taskID,
          bucket,
        },
      });
      draggingElemnet.classList.remove("dragging");
    });
  };

  const handleDeleteBucket = async (bucket) => {
    try {
      await deleteBucket({
        variables: {
          id: project._id,
          bucket,
        },
        refetchQueries: [
          { query: getProjectDetailsQuery, variables: { id: project._id } },
        ],
      });
    } catch (err) {
      errorHandler(err.message);
    }
  };

  return (
    <div className='board'>
      <div
        className={`board-body ${
          filter === "bucket" ? "board-bk" : "board-pg"
        }`}
      >
        {filter === "bucket" && project ? (
          project.buckets.map((bucket) => (
            <div
              id={bucket}
              bucket={bucket}
              onDragOver={(e) => handleDragOver(e, bucket)}
              className='board-bucket drag-container drg'
            >
              <h4>
                {bucket}
                {project.owner._id === userID ? (
                  <i
                    onClick={(e) => handleDeleteBucket(bucket)}
                    className='fal fa-times-circle '
                  ></i>
                ) : null}
              </h4>
              <select id='board-select' className='hide'>
                {project.tasks.map((task) => (
                  <option
                    bucket={bucket}
                    value={task._id}
                    onClick={(e) => handleAddTaskToBucket(e)}
                  >
                    {task.name}
                  </option>
                ))}
              </select>
              {project.owner._id === userID ? (
                <button
                  id='add-task-to-bucket'
                  bucket={bucket}
                  onClick={(e) => showSelect(e)}
                >
                  add task
                </button>
              ) : null}
              {project.tasks
                .filter((task) => task.bucket === bucket)
                .map((task) => (
                  <TaskCard
                    task={task}
                    project={project}
                    errorHandler={errorHandler}
                  />
                ))}
            </div>
          ))
        ) : (
          <>
            <div>
              <h4>Not Started</h4>
              {project &&
                project.tasks
                  .filter((task) => {
                    return task.completion === 0;
                  })
                  .map((task) => <TaskCard task={task} project={project} />)}
            </div>
            <div>
              <h4>In progress</h4>
              {project &&
                project.tasks
                  .filter((task) => {
                    return task.completion > 0 && task.completion < 100;
                  })
                  .map((task) => <TaskCard task={task} project={project} />)}
            </div>
            <div>
              <h4>Finished</h4>
              {project &&
                project.tasks
                  .filter((task) => {
                    return task.completion === 100;
                  })
                  .map((task) => <TaskCard task={task} project={project} />)}
            </div>
          </>
        )}
      </div>
      {filter === "bucket" && project.owner._id === userID ? (
        <form
          ref={bucketNode}
          id='add-bucket-form'
          onSubmit={showForm ? (e) => handleAddBucket(e) : () => showInput()}
          className='add-new-bucket'
        >
          {showForm && (
            <input
              id='bucket-input'
              required={true}
              type='text'
              onChange={(e) => setBucket(e.target.value)}
            />
          )}
          <button onClick={(e) => showInput(e)}>+ New Bucket</button>
        </form>
      ) : null}
    </div>
  );
};

export default Board;
