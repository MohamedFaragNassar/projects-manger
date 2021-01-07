import React from 'react'
import { useHistory } from 'react-router-dom'

const Profile = () => {
    const history = useHistory()
    const data =localStorage.getItem("userInfo")?JSON.parse(localStorage.getItem("userInfo")).login:null
    console.log(data)
    if(!data){
        return history.push("/main")
    }
    return (
        <div>
          <div>{data.userName}</div>
          <div>{data.fullName}</div>
          <div>{data.email}</div>
        </div>
    )
}

export default Profile
