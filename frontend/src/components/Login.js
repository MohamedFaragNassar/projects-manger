import React, {useEffect, useState } from 'react'
import {useMutation} from '@apollo/client'
import {loginQuery} from '../queries/userQueries'
import { Link, Redirect, useHistory } from 'react-router-dom'
import Status from '../components/Status'
import Spinner from '../components/Spinner'

const Login = () => {
    const [email,setEmail] = useState()
    const [password,setPassword] = useState()
    const [error,setError] = useState()
    const [data,setData] = useState()

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
                localStorage.setItem("userInfo",JSON.stringify(data.login))
                setData(data)
            }
        }catch(error){
            setError(error)
        }
    }

    useEffect(()=>{
        if(data){
            window.location.href = "/"
        }
    },[data])
    
    return <>
        <form onSubmit={(e)=>handlSignin(e)} className="login-form">
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
                    <button type="submit">Sign in</button>
                    <Link to="/signup" >create new account </Link>
                </section>
                {loading?<Spinner/>:error?<Status isOpen={true} message={error.message} />:null}
        </form>
            
    </>
}

export default Login
