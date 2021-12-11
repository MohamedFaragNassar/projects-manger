import React, { useEffect, useState } from 'react'
import {Redirect, Route, useHistory } from 'react-router-dom'
import Login from '../components/Login'
import RegisterScreen from '../screens/RegisterScreen'
import GuestScreen from './GuestScreen'

const SignScreen = () => {
    const userInfo = localStorage.getItem("userInfo")

    if(userInfo){
        return <Redirect path="/" />
    }
    else{
    return (
        <div className="register" >
            <img className="welcome-img" src="./Business_SVG.svg" />
            <Route path="/signup" component={RegisterScreen} />
            <Route path="/signin" component={Login} />
            <Route path="/guest" component={GuestScreen} />
        </div>
    )
    }
}

export default SignScreen
