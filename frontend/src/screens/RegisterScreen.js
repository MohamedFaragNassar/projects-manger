import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import {registerUser} from '../Actions/userAction'
import {useMutation} from '@apollo/client'
import {registerUserMutation} from '../queries/userQueries'
import Status from '../components/Status'

const RegisterScreen = () => {
   // const {loading , error,dataError , user}= useSelector(state => state.addUser)

    const [userName,setUserName] = useState()
    const [firsName,setFirsName] = useState()
    const [lastName,setLastName] = useState()
    const [email,setEmail] = useState()
    const [password,setPassword] = useState()
    const [confirmPassword,setConfirmPassword] = useState()
    const [error,setError] = useState()

    const [register,{loading}] = useMutation(registerUserMutation)
    
   
    const history = useHistory()

    const handlRegister = async(e) =>{
        console.log(userName , email , password , firsName , lastName ,confirmPassword)
        if(userName && email && password && firsName && lastName && confirmPassword){
            console.log("mmm")
            e.preventDefault()
            if(password !== confirmPassword){
               setError("password should match")
            }else{
                try{
                    const {data}= await register({variables:{
                   user:{
                    userName,
                    fullName:`${firsName} ${lastName}`,
                    password,
                    email
                   }
                    }})

                    if(data){
                        history.push("/signin")
                    }
                }catch(error){
                    console.log(error.message)
                setError(error.message)
            }
               
            }

        }

    }
    
    return (
        <form className="register-form">
            <h3>Sign Up</h3>
                <div>
                    <label>User Name  </label>
                    <input onChange={(e)=>setUserName(e.target.value)} type="text" required={true} />
                </div>
                <div>
                    <label>First Name  </label>
                    <input onChange={(e)=>setFirsName(e.target.value)} type="text" required={true} />
                </div>
                <div>
                    <label>Last Name </label>
                    <input onChange={(e)=>setLastName(e.target.value)} type="text" required={true} />
                </div>
                <div>
                    <label>Email </label>
                    <input onChange={(e)=>setEmail(e.target.value)} type="email" required={true} />
                </div>
                <div>
                    <label>Password </label>
                    <input onChange={(e)=>setPassword(e.target.value)} type="password" required={true} />
                </div>
                <div>
                    <label>Confirm Password </label>
                    <input className="confirm-pass" onChange={(e)=>setConfirmPassword(e.target.value)} type="password" required={true} />
                   
                </div>
                <section>
                    <button onClick={(e)=>handlRegister(e)} >Sign up</button>
                    <Link to="/signin" >Already have Account? sign in </Link>
                </section>
            {error?<Status message={error} isOpen={true} />:null}
            </form>
     )
}

export default RegisterScreen
