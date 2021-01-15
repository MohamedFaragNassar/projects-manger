import React,{ useEffect, useState } from 'react'
import {useMutation} from '@apollo/client'
import {loginQuery} from '../queries/userQueries'
import { Link, useHistory } from 'react-router-dom'

const GhuestScreen = () => {

    const [logUserIn] = useMutation(loginQuery)
    const userInfo =localStorage.getItem("userInfo")
    const history = useHistory()

    const handlSignin = async() =>{
        try{
           const {data} = await logUserIn({
                variables:{
                    email:"exampleuser2020@gmail.com",
                    password:"Example123456"
                }
            })
            if(data){
                localStorage.setItem("userInfo",JSON.stringify(data))
               history.push("/")
            }
        }catch(error){
           console.log(error)
        }
    }
    useEffect(() => {
        if(!userInfo){
            history.push("/ghuest")
        }
    }, [userInfo])

    return (
        <div className="ghuest">
            <h3>Project Manger</h3>
            <p>The power to make project management simple</p>
            <div className="ghuest-links" >
                <Link className="join-now" to="/signup">Join Now</Link>
                <Link to="/signin">Already have Account? sign in</Link>
            </div>
            <div onClick={()=>handlSignin()} className="pre-made">
                <img src="account.png" />
                <span>Pre-Made Account</span>
            </div>
        </div>
    )
}

export default GhuestScreen
