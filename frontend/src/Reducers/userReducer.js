import {USER_LOGOUT, USER_REGISTER_SUCCESS,USER_REGISTER_FAIL,USER_REGISTER_REQUIST
        ,USER_SIGNIN_FAIL,USER_SIGNIN_SUCCESS
        ,USER_PROFILE_SUCCESS,USER_PROFILE_FAIL
        ,USER_PROFILE_REQUEST,LIST_USERS_SUCCESS,LIST_USERS_FAIL,LIST_USERS_REQUEST,
    UPDATE_PROFILE_FAIL,UPDATE_PROFILE_REQUEST,UPDATE_PROFILE_SUCCESS,
ADD_SHIPPING_FAIL,ADD_SHIPPING_SUCCESS,ADD_SHIPPING_REQUEST,DELETE_SHIPPING
,DELETE_USER,CLEAR_REGISTER,USER_SIGNIN_REQUIST,USER_SIGNIN_DATAERROR,USER_REGISTER_DATAERROR,
UPDATE_IMAGE_FAIL,UPDATE_IMAGE_REQUEST,UPDATE_IMAGE_SUCCESS,CLEAR_UPDATE_IMAGE,CLEAR_UPDATE_PROFILE} from "../Constants/userConstants"

function userSignReducer(state={},action){
    switch(action.type){
        case USER_SIGNIN_REQUIST:
            return {...state,loading:true}
        case USER_SIGNIN_SUCCESS:
            return {loading:false,userData:action.payload}
        case USER_SIGNIN_FAIL:
            return {loading:false,error:action.payload}
        case USER_SIGNIN_DATAERROR:
            return {loading:false, dataError: action.payload}    
        case USER_LOGOUT :
            return {}    
        default :
            return state;        
    }
}

function registerUserReducer(state={},action){
    switch(action.type){
        case USER_REGISTER_REQUIST:
            return {...state,loading:true}
        case USER_REGISTER_SUCCESS:
            return {loading:false,user:action.payload}
        case USER_REGISTER_FAIL :
            return {loading:false,error:action.payload} 
        case USER_REGISTER_DATAERROR : 
            return {loading: false, dataError:action.payload}    
        case CLEAR_REGISTER :
            return {};       
        default :
            return state;        
    }
}



function userDetailsReducer(state={userProfile:{}},action){
    switch(action.type){
        case USER_PROFILE_REQUEST :
            return { ...state , loading:true }
        case USER_PROFILE_SUCCESS :
            return { loading:false , userProfile: action.payload }    
        case USER_PROFILE_FAIL :
            return {loading:false , error: action.payload}
        default :
            return state;        
    }
}

function updateProfileReducer(state={},action){
    switch(action.type){
        case UPDATE_PROFILE_REQUEST :
            return { ...state , loading:true }
        case UPDATE_PROFILE_SUCCESS :
            return { loading:false , update: action.payload }    
        case UPDATE_PROFILE_FAIL :
            return {loading:false , error: action.payload}
        case CLEAR_UPDATE_PROFILE:
            return {}    
        default :
            return state;        
    }
}

function updateImageReducer(state={},action){
    switch(action.type){
        case UPDATE_IMAGE_REQUEST :
            return { ...state , imageLoading:true }
        case UPDATE_IMAGE_SUCCESS :
            return { imageLoading:false, image: action.payload }    
        case UPDATE_IMAGE_FAIL :
            return {imageLoading:false , imageError: action.payload}
        case CLEAR_UPDATE_IMAGE:
            return {}    
        default :
            return state;        
    }
}



function getUsersReducer(state={users:[]},action){
    switch(action.type){
        case LIST_USERS_REQUEST :
            return { ...state , loading:true }
        case LIST_USERS_SUCCESS :
            return { loading:false , users: action.payload }    
        case LIST_USERS_FAIL :
            return {loading:false , error: action.payload}
        case DELETE_USER :
            return {loading:false,users:state.users.filter(user => {return user._id != action.payload})}    
        default :
            return state;        
    }
}



export {userSignReducer,userDetailsReducer,getUsersReducer,updateProfileReducer,registerUserReducer,updateImageReducer}