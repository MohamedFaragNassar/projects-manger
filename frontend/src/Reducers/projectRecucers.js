import {ADD_PROJECT_FAIL,ADD_PROJECT_REQUIST,ADD_PROJECT_SUCCESS,
        GET_PROJECTS_FAIL,GET_PROJECTS_SUCCESS,GET_PROJECTS_REQUIST,
        GET_PROJECT_DETAILS_FAIL,GET_PROJECT_DETAILS_SUCCESS,GET_PROJECT_DETAILS_REQUIST,
        DELETE_PROJECT_FAIL,DELETE_PROJECT_REQUIST,DELETE_PROJECT_SUCCESS} from '../Constants/projectConstants'


const addProjectReducer = (state={},action)=>{
    switch(action.type){
        case ADD_PROJECT_REQUIST:
            return {...state,loading:true}
        case ADD_PROJECT_SUCCESS:
            return {loading:false,project:action.payload}
        case ADD_PROJECT_FAIL:
            return {loading:false,error:action.payload}
        default:
            return state;            
    }
}

const getProjectsReducer = (state={},action)=>{
    switch(action.type){
        case GET_PROJECTS_REQUIST:
            return {...state,projectsLoading:true}
        case GET_PROJECTS_SUCCESS:
            return {projectsLoading:false,projects:action.payload}
        case GET_PROJECTS_FAIL:
            return {projectsLoading:false,projectsError:action.payload}
        default:
            return state;            
    }
}


const getProjectDetailsReducer = (state={},action)=>{
    switch(action.type){
        case GET_PROJECT_DETAILS_REQUIST:
            return {...state,loading:true}
        case GET_PROJECT_DETAILS_SUCCESS:
            return {loading:false,project:action.payload}
        case GET_PROJECT_DETAILS_FAIL:
            return {loading:false,error:action.payload}
        default:
            return state;            
    }
}



const deleteProjectReducer = (state={},action)=>{
    switch(action.type){
        case DELETE_PROJECT_REQUIST:
            return {...state,delProjLoading:true}
        case DELETE_PROJECT_SUCCESS:
            return {delProjLoading:false,delProject:action.payload}
        case DELETE_PROJECT_FAIL:
            return {delProjLoading:false,delProjError:action.payload}
        default:
            return state;            
    }
}


export {
    addProjectReducer,getProjectsReducer,getProjectDetailsReducer,deleteProjectReducer
}