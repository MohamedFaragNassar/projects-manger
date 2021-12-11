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
        <form onSubmit={(e)=>handlSignin(e)} className="register-form">
            <h2 class="form-title">Welcome Back</h2>
            <div className="form-group">
                <input type="email" className="form-input" name="email" id="emailSignin" placeholder="Your Email"
                onChange={(e)=>setEmail(e.target.value)} required={true}/>
            </div>
            <div className="form-group">
                <input type="password" className="form-input" name="password" id="passwordSignin" placeholder="Password"
                onChange={(e)=>setPassword(e.target.value)} required={true}/>
            </div>
            <section>
                <input className="form-btn" type="submit" value="Sign In" />
                <Link to="/signup" >create new account </Link>
            </section>
            {loading?<div style={{width:70+"%"}}><Spinner/></div>
            :error?<Status close={()=>setError(null)} message={error.message}  />:null}
            
        </form>
            
    </>
}

export default Login
