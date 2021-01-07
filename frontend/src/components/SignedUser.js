import React, { useRef } from "react"
import {Link, useHistory} from 'react-router-dom'
import {useClickToClose} from "../components/ClickToClose"

const SignedUser = () => {
   const history = useHistory()

    const  handleShowMenu = () =>{
        const menu = document.querySelector(".nav-user-menu")
        const usernav = document.querySelector(".nav-user")
        menu.classList.add("show")
        usernav.classList.add("rm-b")
    }


    function hideMenu(){
        const menu = document.querySelector(".nav-user-menu")
        const usernav = document.querySelector(".nav-user")

        menu.classList.remove("show")
        usernav.classList.remove("rm-b")

    }

    const userNav = useRef()
    const domNode = useClickToClose(hideMenu,userNav)


    const HandleLogout = (e) => {
        localStorage.removeItem("userInfo")
        history.push("/ghuest")
      } 

    return <>
        <div ref={userNav} onClick={()=>handleShowMenu()} className="nav-user">
            <img src="./logo192.png"  alt=""/>
            <i class="fas fa-chevron-down"></i>
        </div>
        <div ref={domNode}  id='user-menu' className="nav-user-menu">
            <ul>
                <li><Link onClick= {()=> hideMenu()} to={"/profile"}>Veiw Profile</Link></li>
                <li><Link  onClick= {()=> hideMenu()}  to="">Edit profile</Link></li>
                <li><button onClick={(e)=>HandleLogout(e)}>Log out</button></li>
            </ul>
        </div> 
    </>
}

export default SignedUser
