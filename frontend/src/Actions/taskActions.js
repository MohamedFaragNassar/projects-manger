import {ADD_TASK_FAIL,ADD_TASK_REQUIST,ADD_TASK_SUCCESS} from '../Constants/taskConstants'
import Axios from 'axios'

const addTask = (task) => async(dispatch,getState) => {
    dispatch({type:ADD_TASK_REQUIST})
    try{
        const {userSignIn:{userData}} = getState()
        const {data} = await Axios.post("/api/tasks/",task,{
            headers:{
                Authorization: `Bearer ${userData.token}`,
            }
        })
        dispatch({type:ADD_TASK_SUCCESS,payload:data})
    }catch(error){
        dispatch({type:ADD_TASK_FAIL,payload:error})
    }
}

export{
    addTask
}