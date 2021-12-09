import React,{ useEffect, useState } from 'react'
import {useMutation} from '@apollo/client'
import {loginQuery} from '../queries/userQueries'
import { Link, Redirect, useHistory } from 'react-router-dom'

const GhuestScreen = () => {

    const [logUserIn] = useMutation(loginQuery)
    const userInfo =localStorage.getItem("userInfo")
    const history = useHistory()

    const handlSignin = async() =>{
        try{
           const {data} = await logUserIn({
                variables:{
                    email:"mfnemo60@yahoo.com",
                    password:"Nassar60"
                }
            })
            if(data){
                localStorage.setItem("userInfo",JSON.stringify(data.login))
                window.location.href = "/";
            }
        }catch(error){
           console.log(error)
        }
    }
    useEffect(() => {
        if(!userInfo){
            history.push("/guest")
        }
    }, [userInfo])

    return (
        <div className="guest">
            <h3>Project Manger</h3>
            <p>Meet the simple, powerful, reimagined Project Mangment Solution for everyone.</p>
            <div className="guest-links" >
                <Link className="join-now" to="/signup">Get Started</Link>
                <Link className="signin" to="/signin">Already have Account? sign in</Link>
            </div>
            <div onClick={()=>handlSignin()} className="pre-made">
                <img src="account.png" />
                <span>Pre-Made Account</span>
            </div>
        </div>
    )
}

export default GhuestScreen
