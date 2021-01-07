import React from 'react'
import {useMutation} from '@apollo/client'
import {loginQuery} from '../queries/userQueries'
import { Link, useHistory } from 'react-router-dom'

const GhuestScreen = () => {

    const [logUserIn] = useMutation(loginQuery)
    const history = useHistory();

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


    return (
        <div className="ghuest">
            <h3>Project Manger</h3>
            <p>The power to make project management simple</p>
            <div className="ghuest-text">
                Stay organized, focused, and in charge. Tackle anything from small
                 projects to large initiatives. You may or may not be a project manager,
                 but now you can be the boss of any project with a powerful, easy-to-use app.
            </div>
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
