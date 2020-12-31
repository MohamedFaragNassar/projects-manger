import {ADD_PROJECT_FAIL,ADD_PROJECT_REQUIST,ADD_PROJECT_SUCCESS,
        GET_PROJECTS_FAIL,GET_PROJECTS_REQUIST,GET_PROJECTS_SUCCESS
        ,GET_PROJECT_DETAILS_FAIL,GET_PROJECT_DETAILS_REQUIST,GET_PROJECT_DETAILS_SUCCESS,
    DELETE_PROJECT_FAIL,DELETE_PROJECT_REQUIST,DELETE_PROJECT_SUCCESS} from '../Constants/projectConstants'
import Axios from "axios"


const  addProject = (project) => async(dispatch,getState)=>{
    dispatch({type:ADD_PROJECT_REQUIST})
    try{
        const {userSignIn:{userData}} = getState()
        const {data} = await Axios.post("/api/projects/",project,{
            headers:{
                Authorization: `Bearer ${userData.token}`,
            }
        })
        dispatch({type:ADD_PROJECT_SUCCESS,payload:data})
    }catch(error){
        dispatch({type:ADD_PROJECT_FAIL,payload:error})
    }
}

const  getAllProjects = () => async(dispatch,getState)=>{
    dispatch({type:GET_PROJECTS_REQUIST})
    try{
        const {userSignIn:{userData}} = getState()
        const {data} = await Axios.get("/api/projects/",{
            headers:{
                Authorization: `Bearer ${userData.token}`,
            }
        })
        dispatch({type:GET_PROJECTS_SUCCESS,payload:data})
    }catch(error){
        dispatch({type:GET_PROJECTS_FAIL,payload:error})
    }
}

const  getProjectDetails = (id) => async(dispatch,getState)=>{
    dispatch({type:GET_PROJECT_DETAILS_REQUIST})
    try{
        const {userSignIn:{userData}} = getState()
        const {data} = await Axios.get(`/api/projects/PROJECT/${id}`,{
            headers:{
                Authorization: `Bearer ${userData.token}`,
            }
        })
        dispatch({type:GET_PROJECT_DETAILS_SUCCESS,payload:data})
    }catch(error){
        dispatch({type:GET_PROJECT_DETAILS_FAIL,payload:error})
    }
}

const  deleteProject = (id) => async(dispatch,getState)=>{
    dispatch({type:DELETE_PROJECT_REQUIST})
    try{
        const {userSignIn:{userData}} = getState()
        const {data} = await Axios.delete(`/api/projects/PROJECT/${id}`,{
            headers:{
                Authorization: `Bearer ${userData.token}`,
            }
        })
        dispatch({type:DELETE_PROJECT_SUCCESS,payload:data})
    }catch(error){
        dispatch({type:DELETE_PROJECT_FAIL,payload:error})
    }
}



export{
    addProject,getAllProjects,getProjectDetails,deleteProject
}