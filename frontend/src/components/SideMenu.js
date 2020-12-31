import React from 'react'
import {gql, useApolloClient} from '@apollo/client'
import { Link } from 'react-router-dom'
import {hideOrShow} from '../helpers/helpers'


const SideMenu = (props) => {
    const client = useApolloClient()

  const data = client.readQuery({
      query:gql`
      {
          projects {
              myProjects{
                  _id
                  name
              },
              sharedProjects{
                  _id
                  name
              },
              favorites{
                  _id
                  name
              },
              
  
          }
      }
  `
  
  })

    const handleShowMenu = (e) => {
        const icon = e.target.firstElementChild
        const action = icon.classList.contains("fa-chevron-down") ? "show" : "hide"
        if(action === "show"){
            icon.classList.remove("fa-chevron-down")
            icon.classList.add("fa-chevron-up")
        }else{
            icon.classList.remove("fa-chevron-up")
            icon.classList.add("fa-chevron-down")
       }
        hideOrShow(e.target.parentElement,"projects-menu",action)
    }


    if(!props.isOpen){
        return null;
    }
   return (
        <div className="side-menu">
           <div>
               <button onClick={(e)=>handleShowMenu(e)} >My Favorites 
                    <i class="fas fa-chevron-down"></i>
               </button>
               <ul id="projects-menu" className="hide projects-menu-items">
                   {data&&data.projects.favorites.map(pr => 
                    <Link to={`/project/${pr._id}`} >{pr.name}</Link>
                    )}
               </ul>
           </div>
           <div>
               <button onClick={(e)=>handleShowMenu(e)} >My Projects 
                    <i class="fas fa-chevron-down"></i>
               </button>
               <ul id="projects-menu" className="hide projects-menu-items">
                   {data&&data.projects.myProjects.map(pr => 
                    <Link to={`/project/${pr._id}`} >{pr.name}</Link>
                    )}
               </ul>
           </div>
           <div>
               <button onClick={(e)=>handleShowMenu(e)} >Shared Favorites 
                    <i class="fas fa-chevron-down"></i>
               </button>
               <ul id="projects-menu" className="hide projects-menu-items">
                   {data&&data.projects.favorites.map(pr => 
                    <Link to={`/project/${pr._id}`} >{pr.name}</Link>
                    )}
               </ul>
           </div>
        </div>
    )
}

export default SideMenu
