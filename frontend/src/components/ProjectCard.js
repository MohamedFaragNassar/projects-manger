import React from "react";
import { Link } from "react-router-dom";
import { hideOrShow } from "../helpers/helpers";
import { useMutation } from "@apollo/client";
import {
  deleteFavoritesMutation,
  deleteProjectMutation,
  getProjectsQuery,
} from "../queries/projectQueries";

const ProjectCard = ({ project, close }) => {
  const [delFavorites] = useMutation(deleteFavoritesMutation);
  const [delProject] = useMutation(deleteProjectMutation);

  const handleShowMenu = (e) => {
    hideOrShow(e.target.offsetParent, "project-menu", "show");
  };

  const handleDeleteProject = () => {
    delProject({
      variables: { id: project._id },
      refetchQueries: [{ query: getProjectsQuery }],
    });
    close();
  };
  const handleRemoveFavorites = () => {
    delFavorites({
      variables: {
        projectID: project._id,
      },
      refetchQueries: [{ query: getProjectsQuery }],
    });
    close();
  };

  const startDate = new Date(Number(project.createdAt))
    .toISOString()
    .split("T")[0];

  return (
    <div className='project-card'>
      <div id='project-menu' className='project-menu hide'>
        <ul>
          <li>
            <Link to={`/project/${project._id}`}>
              Open<i className='fad fa-external-link'></i>
            </Link>
          </li>
          <li onClick={() => handleDeleteProject()}>
            Delete <i className='fas fa-trash-alt'></i>
          </li>
          <li onClick={() => handleRemoveFavorites()}>
            Remove favorite<i className='far fa-star'></i>
          </li>
        </ul>
      </div>
      <div className='top-sec'>
        <Link to={`/project/${project._id}`}>{project.name}</Link>
        <button onClick={(e) => handleShowMenu(e)}>
          <i className='far fa-ellipsis-v'></i>
        </button>
      </div>
      <div className='pr-date'>
        <i className='fas fa-calendar-alt'></i>
        <div>{startDate}</div>
      </div>
    </div>
  );
};

export default ProjectCard;
