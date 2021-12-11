import React, {useState } from 'react'
import {useLazyQuery, useMutation, useQuery} from '@apollo/client'
import {searchUsersQuery} from '../queries/userQueries'
import {addUsersGroupMutation, getProjectDetailsQuery} from '../queries/projectQueries'
import {useClickToClose} from '../helpers/CTC'

const AddUsers = ({isOpen,close,project,errorHandler}) => {
    const [users,setUsers] = useState([])
    const [showUsers,setShowUsers] = useState([])
    
    const [searchUsers, {loading,data}] = useLazyQuery(searchUsersQuery)
    const [addUsers] = useMutation(addUsersGroupMutation)

    const searchRes = document.querySelector(".search-result")
    
    const debounce = (func, wait, immediate)=> {
        let timeout;
        return function executedFunction() {
          const context = this;
          const args = arguments;
              
          const later =()=> {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
      
          const callNow = immediate && !timeout;
          
          clearTimeout(timeout);
      
          timeout = setTimeout(later, wait);
          
          if (callNow) func.apply(context, args);
        };
      };

      const clearSearch = ()=>{
        const searchRes = document.querySelector(".search-result")
        searchRes.classList.add("hide-search")
        }

        const domNode = useClickToClose(clearSearch,".search-result")

      const searchResult = debounce(async(keyword)=>{
        if(searchRes){
          searchRes.classList.remove("hide-search")
          }
         if(keyword){
            searchUsers({variables:{
                keyword
            }})
             
         } 
        },200)

    const handleAddUser = (e) => {
        setUsers([...new Set([...users,e.target.attributes.value.value])])
        setShowUsers([...new Set([...showUsers,e.target.attributes.username.value])])
    }

    const handleDelUser = (e)=>{
        const user = e.target.previousElementSibling.textContent
        setShowUsers(showUsers.filter(name => {return name != user}))
    }

    
    const handleAddGroup = ()=>{
        addUsers({variables:{
            id:project._id,
            users
        }, refetchQueries:[{query:getProjectDetailsQuery,variables:{
            id:project._id
        }}]})

        close()
        
    }


    if(!isOpen){
        return null
    }
    return <>
        <div className="overlay"></div>
        <div className="add-users new-project ">
        <div className="stages show-users" >
            <div>
                <label>Users</label>
                    <div ref={domNode} className="users-add">
                        <div className='add-users-form'>
                            <input ref={domNode} className={`search-input ${data?.searchUsers?.length > 0 ?"show-res":null}`}
                            onChange={(e)=>searchResult(e.target.value)} type="text" placeholder="Search by username" >
                            </input>
                            {data?.searchUsers?.length > 0 &&<div  className="search-result hide-search">
                                    <ul>
                                        {data?.searchUsers.map(user => 
                                            <li key={user._id} value={user._id} username={user.userName}
                                            onClick={(e)=> handleAddUser(e)}>
                                                <i className="fas fa-user"></i>
                                                <span>{user.userName}</span>
                                            </li>    
                                        )}
                                    </ul>
                            </div>}
                        </div>
                    </div>
                    <div className="list-users list-stages">
                        {showUsers.map((user,index) => 
                            <div key={index}>
                                <span className="stage">{user}</span>
                                <button onClick={(e)=>handleDelUser(e)} >-</button>
                            </div>
                        )}  
                    </div>
                        
                 </div>
            </div>
            <div className=" add-project-btns" >
                    <button onClick={()=> handleAddGroup()} className="confirm" >Add Members</button>
                    <button onClick={close} className="cancel">Cancel</button>
            </div>
        </div>
            
        
    </>
}

export default AddUsers
