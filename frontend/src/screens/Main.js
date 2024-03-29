import React, { useState } from "react";
import NewProject from "../components/NewProject";
import ProjectCard from "../components/ProjectCard";
import { useQuery } from "@apollo/client";
import { getProjectsQuery } from "../queries/projectQueries";
import ShowProjects from "../components/ShowProjects";
import { useClickToClose } from "../helpers/CTC";
import Status from "../components/Status";
import Spinner from "../components/Spinner";

const Main = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [projectsType, setProjectsType] = useState("mine");

  const { data, loading, error } = useQuery(getProjectsQuery);

  const hideMenu = () => {
    const menu = document.querySelector(".project-menu:not(.hide)");
    if (menu) {
      menu.classList.add("hide");
    }
  };

  const domNode = useClickToClose(hideMenu, ".project-menu:not(.hide)");

  const changeProjectsHandler = (type) => {
    const myBtn = document.getElementById("my-projects");
    const sharedBtn = document.getElementById("shared-projects");
    setProjectsType(type);
    if (type === "mine") {
      myBtn.classList.add("show-btn");
      sharedBtn.classList.remove("show-btn");
    } else {
      myBtn.classList.remove("show-btn");
      sharedBtn.classList.add("show-btn");
    }
  };

  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return <Status isOpen={true} message={error.message} />;
  }
  return (
    <>
      <div className='main-page'>
        <div className='add-new-project'>
          <button onClick={() => setIsOpen(true)}>
            <i className='fas fa-plus'></i>Add new project
          </button>
        </div>
        {data && data.projects.favorites.length > 0 ? (
          <div className='favorites'>
            <div className='fav-header'>Favorites</div>
            <div ref={domNode} className='fav-body'>
              {data.projects.favorites.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  close={() => hideMenu}
                />
              ))}
            </div>
          </div>
        ) : null}
        <div className='my-project'>
          <div className='my-projects-btns'>
            <button
              className='show-btn'
              id='my-projects'
              onClick={() => changeProjectsHandler("mine")}
            >
              Created by me{" "}
            </button>
            <button
              id='shared-projects'
              onClick={() => changeProjectsHandler("shared")}
            >
              Shared with me{" "}
            </button>
          </div>
          <ShowProjects
            data={
              data
                ? projectsType === "mine"
                  ? data.projects.myProjects
                  : data.projects.sharedProjects
                : []
            }
            type={projectsType}
            favorites={data.projects.favorites}
          />
        </div>
      </div>
      <NewProject isOpen={isOpen} close={() => setIsOpen(false)} />
    </>
  );
};

export default Main;
