import React, { useEffect } from "react"
import {Route, Redirect, useHistory} from "react-router-dom"


 const ProtectedRoute = ({component:Component,...rest}) =>{
  const userInfo = localStorage.getItem("userInfo")?JSON.parse(localStorage.getItem("userInfo")):null
  const history = useHistory()

  if(!userInfo){
      history.push("/ghuest")
  }


    return (
            <Route {...rest} render = {props => {
                return <Component {...props} />
            }} />
        

    )
    
    
}

export default ProtectedRoute;