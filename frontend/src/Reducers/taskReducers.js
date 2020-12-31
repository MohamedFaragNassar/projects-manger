import {ADD_TASK_FAIL,ADD_TASK_REQUIST,ADD_TASK_SUCCESS} from '../Constants/taskConstants'


const addTaskReducer = (state={},action)=>{
    switch(action.type){
        case ADD_TASK_REQUIST:
            return {...state,taskLoading:true}
        case ADD_TASK_SUCCESS:
            return {taskLoading:false,task:action.payload}
        case ADD_TASK_FAIL:
            return {taskLoading:false,taskError:action.payload}
        default:
            return state;            
    }
}

export {
    addTaskReducer
}