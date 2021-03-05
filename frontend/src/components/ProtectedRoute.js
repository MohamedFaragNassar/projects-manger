import React, { useEffect } from "react"
import {Route, Redirect} from "react-router-dom"
import { useHistory } from 'react-router-dom'


 const ProtectedRoute = ({component:Component,...rest}) =>{
  const userInfo = localStorage.getItem("userInfo")
  const history = useHistory()

  

  /* useEffect(() => {
        if(!userInfo){
            history.push("/ghuest")
        }
    }, [userInfo])
 */
    return (
        <Route {...rest} render = {props => {
            return <Component {...props} />
        }} />
    )
  
    
}

export default ProtectedRoute;