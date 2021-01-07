import React from "react"
import {Route, Redirect} from "react-router-dom"


 const UnRegisteredRoute = ({component:Component,...rest}) =>{
  const userInfo =localStorage.getItem("userInfo")

  
        return (
            <Route {...rest} render = {props => {
                if(!userInfo){
                    return <Component {...props} />
                }else{
                    return <Redirect to={{pathname:"/"}}/>
                }
            }} />
        )
  
    
}

export default UnRegisteredRoute;