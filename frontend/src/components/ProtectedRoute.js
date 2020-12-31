import React from "react"
import {Route, Redirect} from "react-router-dom"
import {useSelector } from "react-redux"

 const ProtectedRoute = ({component:Component,...rest}) =>{
  const userInfo =localStorage.getItem("userInfo")

  
        return (
            <Route {...rest} render = {props => {
                if(userInfo){
                    return <Component {...props} />
                }else{
                    return <Redirect to={{pathname:"/ghuest"}}/>
                }
            }} />
        )
  
    
}

export default ProtectedRoute;