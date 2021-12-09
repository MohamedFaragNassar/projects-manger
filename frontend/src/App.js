import { useState } from 'react';
import {BrowserRouter, Link, Route} from 'react-router-dom'
import './App.css';
import SideMenu from './components/SideMenu'
import Main from './screens/Main'
import ProjectScreen from './screens/ProjectScreen'
import SignedUser from './components/SignedUser'
import UnSignedUser from './components/unSignedUser'
import ProtectedRoute from './components/ProtectedRoute'
import SignScreen from './screens/SignScreen';
import Profile from './screens/Profile';

function App() {

const userData =localStorage.getItem("userInfo")?JSON.parse(localStorage.getItem("userInfo")):null
const [status,setStatus] = useState("hide-menu")

 const sideMenuHandler = ()=>{
   const main = document.getElementById("main")
   main.classList.toggle("main-v2")
   const newState = status === "hide-menu" ? "show-menu" : "hide-menu"
   setStatus(newState)
 } 

  return   <BrowserRouter >
    <div className="container" >
    <header className="navigation">
          <Link to={userData ? "/" : "/guest"} className="logo" >Project Manger</Link>
          <div className="user">
            {userData ? <SignedUser/> :<UnSignedUser/> }
            
          </div>
      </header>
      <div  id="main"  className="main">
              {userData?<div className="sidebar">
                    <div className="side-nav">
                      <button className="home-btn" to="/" onClick={()=>sideMenuHandler()} >
                        <i className="far fa-bars"></i>
                      </button>
                      <Link className="home-btn" to="/"><i className="far fa-home-lg-alt"></i></Link>
                    </div>
                    <SideMenu status={status} />
              </div>:<div style={{width:0+"px"}}></div>}
              <div className="main-section">
                  <Route path="/guest" component={SignScreen} />
                  <Route path="/signin"  component={SignScreen} />
                  <Route path="/signup"  component={SignScreen} />
                  <ProtectedRoute path="/project/:id"  component={ProjectScreen} />
                  <ProtectedRoute path="/profile/:id"  component={Profile} />
                  <ProtectedRoute path="/"  exact={true} component={Main} />
              </div>
      </div>
      
    </div>
    </BrowserRouter>
}

export default App;
