import React, { useEffect, useState } from 'react'
import {Redirect, Route, useHistory } from 'react-router-dom'
import Login from '../components/Login'
import RegisterScreen from '../screens/RegisterScreen'
import GhuestScreen from './GhuestScreen'

const SignScreen = () => {
    const userInfo = localStorage.getItem("userInfo")

    if(userInfo){
        return <Redirect path="/" />
    }
    else{
    return (
        <div className="register" >
            <section className="img-container" >
                <img src="./Business_SVG.svg" />
            </section>
            <Route path="/signup" component={RegisterScreen} />
            <Route path="/signin" component={Login} />
            <Route path="/ghuest" component={GhuestScreen} />
        </div>
    )
    }
}

export default SignScreen
