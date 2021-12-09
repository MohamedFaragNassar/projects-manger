import React, { useEffect, useState } from 'react'
import {useQuery} from '@apollo/client'
import {getProfileInfoQuery} from '../queries/projectQueries'
import Spinner from '../components/Spinner'
import Status from '../components/Status'
import {modifyDate} from '../helpers/helpers'
import UpdateProfile from '../components/UpdateProfile'
import {useClickToClose} from '../helpers/CTC'

const Profile = (props) => {
    const userData =localStorage.getItem("userInfo")?JSON.parse(localStorage.getItem("userInfo")):null
    const id = props.match.params.id
    let AllowEdit
    if(userData && userData.id == id){
        AllowEdit = true
    }
    const {loading,error,data} =useQuery(getProfileInfoQuery,{variables:{id}})
    const [isOpen,setIsOpen] = useState(false)
    const [isUploaded,setIsUploaded] = useState(false) 
    const [uploadError,setError] = useState() 
    const domNode = useClickToClose(()=>setIsOpen(false),".edit-profile")

    
    const uploadHandler = async(e)=>{
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append("image",file)

        fetch("/upload/",{
            headers:{
              Authorization: `Bearer ${userData.token}`,
              },
              body:formData,
              method:"POST"
          })
          .then(res => res.json())
          .then(data => document.location.reload())
          .catch(err => setError("Somthing went wrong when trying to update the profile image, please try again"))
      
    }

    useEffect(() => {
       
    }, [isUploaded])
    
    useEffect(() => {
        const menu = document.getElementById("user-menu")
        const usernav = document.querySelector(".nav-user")

        menu.classList.remove("show")
        usernav.classList.remove("rm-b")
        
    }, [])

    if(loading){
        return <Spinner/>
    }
    if(error){
        return <Status isOpen={true} message={error.message} />
    }
    return <>
         <div className="profile">
            {AllowEdit?<button onClick={()=>setIsOpen(true)} className="edit-profile-btn" ><i class="far fa-edit"></i></button>:null}
            <div className="profile-img" >
                <img src={`../${data.profile.user._id}.jpg`}  onError={(e)=>e.target.src="../account.jpg"} />
                {AllowEdit?<div>
                    <label for="upload-image" className="upload-image" ><i class="fal fa-camera-alt"></i></label >
                    <input onChange={(e)=>uploadHandler(e)} type="file" id="upload-image" className="hide" />
                </div>:null}
            </div>
              <div className="profile-name">
                  <span className="full-name" >{data.profile.user.fullName}</span>
                  <span>@{data.profile.user.userName}</span>
                  <span>{`joined at ${modifyDate(Number(data.profile.user.createdAt))}`}</span>
              </div>
              <div className="profile-info"  >
                <div className="profile-email">
                    <i class="far fa-envelope"></i>
                    <span >{data.profile.user.email}</span>
                </div>
                    <div>
                            <i class="fas fa-project-diagram"></i>
                            <span>Created Projects :  </span>
                            <span>{data.profile.createdProjects}</span>
                        </div>
                        <div>
                            <i class="fas fa-project-diagram"></i>
                            <span>Projects participated In  :  </span>
                            <span>{data.profile.sharedProjects}</span>
                    </div>
              </div>
              {uploadError&&<Status isOpen={true} message={uploadError} />}
        </div> 
        <UpdateProfile isOpen={isOpen} close={()=>setIsOpen(false)} user={data.profile.user} node={domNode} />
    </>
}

export default Profile
