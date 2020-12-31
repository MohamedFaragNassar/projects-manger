import React, { useEffect, useState } from 'react'
import {useLazyQuery,useMutation} from '@apollo/client'
import {loginQuery} from '../queries/userQueries'
import { Link, useHistory } from 'react-router-dom'
import Spinner from '../components/Spinner'
import Status from '../components/Status'

const Login = () => {
    const [email,setEmail] = useState()
    const [password,setPassword] = useState()
    const [error,setError] = useState()

    const [logUserIn, {loading}] = useMutation(loginQuery)
    const history = useHistory();

    
    const handlSignin = async(e) =>{
        e.preventDefault()
        try{
           const {data} = await logUserIn({
                variables:{
                    email,
                    password
                }
            })
            if(data){
                localStorage.setItem("userInfo",JSON.stringify(data))
               history.push("/")
            }
        }catch(error){
            setError(error)
        }
    }

    
 
    return <>
        <form className="login-form">
                <h3>Welcome</h3>
                <div>
                    <label>Email </label>
                    <input onChange={(e)=>setEmail(e.target.value)} type="email" required={true} />
                </div>
                <div>
                    <label>Password </label>
                    <input onChange={(e)=>setPassword(e.target.value)} type="password" required={true} />
                </div>
                <section>
                    <button onClick={(e)=>handlSignin(e)} type="submit">Sign in</button>
                    <Link to="/signup" >create new account </Link>
                </section>
                {loading?<span>loading</span>:error?<Status isOpen={true} message={error.message} />:null}
            </form>
            
    </>
}

export default Login
