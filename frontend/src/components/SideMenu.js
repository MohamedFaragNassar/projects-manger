import React from "react";
import { gql, useApolloClient } from "@apollo/client";
import { Link } from "react-router-dom";
import { hideOrShow } from "../helpers/helpers";

const SideMenu = ({ status }) => {
  const client = useApolloClient();

  const data = client.readQuery({
    query: gql`
      {
        projects {
          myProjects {
            _id
            name
          }
          sharedProjects {
            _id
            name
          }
          favorites {
            _id
            name
          }
        }
      }
    `,
  });

  const handleShowMenu = (e) => {
    const icon = e.target.lastElementChild;
    const action = icon?.classList.contains("fa-chevron-down")
      ? "show"
      : "hide";
    if (action === "show") {
      icon?.classList.remove("fa-chevron-down");
      icon?.classList.add("fa-chevron-up");
    } else {
      icon?.classList.remove("fa-chevron-up");
      icon?.classList.add("fa-chevron-down");
    }
    hideOrShow(e.target.parentElement, "projects-menu", action);
  };

  console.log(data);

  return (
    <div className={`side-menu ${status}`}>
      <div>
        <button onClick={(e) => handleShowMenu(e)}>
          <span>My Favorites</span>
          <i className='fas fa-chevron-down'></i>
        </button>
        <ul id='projects-menu' className='hide projects-menu-items'>
          {data &&
            data.projects.favorites.map((pr) => (
              <Link key={pr._id} to={`/project/${pr._id}`}>
                {pr.name}
              </Link>
            ))}
        </ul>
      </div>
      <div>
        <button onClick={(e) => handleShowMenu(e)}>
          My Projects
          <i className='fas fa-chevron-down'></i>
        </button>
        <ul id='projects-menu' className='hide projects-menu-items'>
          {data &&
            data.projects.myProjects.map((pr) => (
              <Link key={pr._id} to={`/project/${pr._id}`}>
                {pr.name}
              </Link>
            ))}
        </ul>
      </div>
      <div>
        <button onClick={(e) => handleShowMenu(e)}>
          Shared Projects
          <i className='fas fa-chevron-down'></i>
        </button>
        <ul id='projects-menu' className='hide projects-menu-items'>
          {data &&
            data.projects.sharedProjects.map((pr) => (
              <Link key={pr._id} to={`/project/${pr._id}`}>
                {pr.name}
              </Link>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default SideMenu;
