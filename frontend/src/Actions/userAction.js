import Cookie from "js-cookie"
import Axios from "axios"
import {USER_LOGOUT, USER_REGISTER_SUCCESS,USER_REGISTER_FAIL
        ,USER_SIGNIN_FAIL,USER_SIGNIN_SUCCESS,USER_UPDATE_FAIL
        ,USER_UPDATE_SUCCESS,USER_PROFILE_FAIL,USER_PROFILE_REQUEST
        ,USER_PROFILE_SUCCESS,LIST_USERS_FAIL,LIST_USERS_REQUEST,LIST_USERS_SUCCESS,
      UPDATE_PROFILE_FAIL,UPDATE_PROFILE_REQUEST,UPDATE_PROFILE_SUCCESS,DELETE_USER
    ,USER_REGISTER_REQUIST,USER_SIGNIN_DATAERROR, USER_SIGNIN_REQUIST
    ,USER_REGISTER_DATAERROR, CLEAR_REGISTER,UPDATE_IMAGE_FAIL,UPDATE_IMAGE_REQUEST
    ,CLEAR_UPDATE_IMAGE,UPDATE_IMAGE_SUCCESS,GET_IMAGE, CLEAR_UPDATE_PROFILE} from "../Constants/userConstants"



const getUsers = () => async(dispach,getState) => {
        dispach({type:LIST_USERS_REQUEST})
        const {userSignIn :{userData}} = getState();
        try{
          const {data} = await Axios.get("/api/users",{
              headers:{
                  Authorization: `Bearer ${userData.token}`,
              }
          })
          dispach({type:LIST_USERS_SUCCESS, payload:data})
        }catch(error){
          dispach({type:LIST_USERS_FAIL,payload:error})
        }
}



const registerUser = (user) => async(dispach)=>{
  console.log(user)
  dispach({type:USER_REGISTER_REQUIST})
  try{
    const {data} = await Axios.post("/api/users/",user,{
      headers: {
        'Content-Type': 'application/json',
      },
    })
    dispach({type:USER_REGISTER_DATAERROR,payload:data})
   }catch(error){
    dispach({type:USER_REGISTER_FAIL,payload:error})
  }
}


const signin = (email,password) => async (dispatch) => {
    dispatch({type:USER_SIGNIN_REQUIST})
    try{
        const config = {
            headers: {
              'Content-Type': 'application/json',
            },
          }
      
        const { data } = await Axios.post("/api/users/signin",{email,password}, config)
        if(data != "incorrect password" && data != "Email not found"){
          dispatch({type:USER_SIGNIN_SUCCESS,payload:data})
          Cookie.set("userInfo", JSON.stringify(data))
        }else{
            dispatch({type:USER_SIGNIN_DATAERROR,payload:data})
            setTimeout(()=>{
              dispatch({type:USER_LOGOUT})
            },5000)
        }
    }catch(error){
        dispatch({type:USER_SIGNIN_FAIL, payload: error})
    }
 } 
 
 
 const logout = () => (dispatch)=>{
   Cookie.remove("userInfo")
   dispatch({type:USER_LOGOUT})
 }

 const getUserDetails = () => async (dispach,getState) =>{

  dispach({type:USER_PROFILE_REQUEST})

  const {userSignIn :{userData}} = getState()

  try{
      const {data} = await Axios.get("/users/profile",{
      headers:{
          Authorization: `Bearer ${userData.token}`,
        }
      })
      
      dispach({type:USER_PROFILE_SUCCESS,payload:data})
  }catch(error){
    dispach({type:USER_PROFILE_FAIL,payload:error})
  }
 
 }

 const updateProfile = (userInfo) => async(dispatch,getState)=>{
    dispatch({type:UPDATE_PROFILE_REQUEST})
    try{
      const {userSignIn:{userData}} =getState()
      const {data} = await Axios.put("/users/profile",userInfo,{
        headers:{
          'Content-Type': 'application/json',
           Authorization: `Bearer ${userData.token}`,
        }
      })
      dispatch({type:UPDATE_PROFILE_SUCCESS,payload:data})
      setTimeout(()=>{
        dispatch({type:CLEAR_UPDATE_PROFILE})
      },5000)
    }catch(error){
      dispatch({type:UPDATE_PROFILE_FAIL,payload:"Somthing went wrong"})
      setTimeout(()=>{
        dispatch({type:CLEAR_UPDATE_PROFILE})
      },5000)
    }
  }


  const deleteUser = (id)=> async(dispach,getState)=>{
    try{
      const {userSignIn:{userData}} =getState()
      const {data} = await Axios.delete(`/users/delete/${id}`,{
        headers:{
          'Content-Type': 'application/json',
           Authorization: `Bearer ${userData.token}`,
        }
      })
      dispach({type:DELETE_USER,payload:data})
    }catch(error){
      throw Error(error)
    }
  }

  const updateImage = (image) =>async(dispatch,getState)=>{
    dispatch({type:UPDATE_IMAGE_REQUEST})
    try{
      const {userSignIn:{userData}} =getState()
      const { data } = await Axios.patch("/users/image",image,{
          headers: {
            'Content-Type': 'application/json',
             Authorization: `Bearer ${userData.token}`,
          },
        })
          dispatch({type:UPDATE_IMAGE_SUCCESS,payload:data})
          setTimeout(()=>{
            dispatch({type:CLEAR_UPDATE_IMAGE})
          },5000)
      
    }catch(error){
        dispatch({type:UPDATE_IMAGE_FAIL, payload: error})
        setTimeout(()=>{
          dispatch({type:CLEAR_UPDATE_IMAGE})
        },5000)
    }
  }

 export  {signin, logout,getUserDetails,getUsers,updateProfile,deleteUser,registerUser,updateImage}