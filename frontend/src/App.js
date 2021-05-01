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
const [isOpen,setIsOpen] = useState(false)

 const sideMenuHandler = ()=>{
   const main = document.getElementById("main")
   main.classList.toggle("main-v2")
   setIsOpen(!isOpen)
 } 

  return   <BrowserRouter >
    <div className="container" >
    <header className="navigation">
          <Link to="/" className="logo" >Project Manger</Link>
          <div className="user">
            {userData ? <SignedUser/> :<UnSignedUser/> }
            
          </div>
      </header>
      <div  id="main"  className="main">
              {userData?<div className="sidebar">
                    <div className="side-nav">
                      <button onClick={()=>sideMenuHandler()} ><i class="far fa-bars"></i></button>
                      <Link to="/"><i class="far fa-home-lg-alt"></i></Link>
                    </div>
                    <SideMenu isOpen={isOpen} />
              </div>:<div></div>}
              <div className="main-section">
                  <Route path="/ghuest" component={SignScreen} />
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
