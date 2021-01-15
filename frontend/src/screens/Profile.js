import React, { useState } from 'react'
import {useQuery} from '@apollo/client'
import {getProfileInfoQuery} from '../queries/projectQueries'
import Spinner from '../components/Spinner'
import Status from '../components/Status'
import {modifyDate} from '../helpers/helpers'
import UpdateProfile from '../components/UpdateProfile'
import {useClickToClose} from '../helpers/CTC'

const Profile = (props) => {
    const id = props.match.params.id
    const {loading,error,data} =useQuery(getProfileInfoQuery,{variables:{id}})
    const [isOpen,setIsOpen] = useState(false)

    const domNode = useClickToClose(()=>setIsOpen(false),".edit-profile")

    if(loading){
        return <Spinner/>
    }
    if(error){
        return <Status isOpen={true} message={error.message} />
    }
    return <>
         <div className="profile">
            <button onClick={()=>setIsOpen(true)} className="edit-profile-btn" ><i class="far fa-edit"></i></button>
            <div className="profile-img" >
                <img src="../account.png" />
                <button className="upload-image" ><i class="fal fa-camera-alt"></i></button>
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
        </div> 
        <UpdateProfile isOpen={isOpen} user={data.profile.user} node={domNode} />
    </>
}

export default Profile
