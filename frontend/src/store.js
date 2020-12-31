import thunk from 'redux-thunk'
import {createStore, combineReducers, applyMiddleware} from "redux"
import Cookie from "js-cookie"
import {registerUserReducer,getUsersReducer,userSignReducer} from './Reducers/userReducer'
import {addProjectReducer,getProjectsReducer,getProjectDetailsReducer,deleteProjectReducer} from './Reducers/projectRecucers'
import {addTaskReducer} from './Reducers/taskReducers'

const userData = Cookie.getJSON("userInfo")

const reducer = combineReducers({
    addUser:registerUserReducer,
    userSignIn:userSignReducer,
    getUsers:getUsersReducer,
    addProject:addProjectReducer,
    getProjects:getProjectsReducer,
    projectDetails:getProjectDetailsReducer,
    deleteProject: deleteProjectReducer,
    addTask:addTaskReducer,
}) 


const initialState = {tasks:[], userSignIn:{userData}}

const store = createStore(reducer,initialState,applyMiddleware(thunk))

export default store;