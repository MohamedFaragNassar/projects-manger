import React, { useRef, useState } from 'react'
import Axios from "axios"
import {useLazyQuery, useMutation, useQuery} from '@apollo/client'
import {searchUsersQuery} from '../queries/userQueries'
import {addUsersGroupMutation} from '../queries/projectQueries'
import {useClickToClose} from '../helpers/CTC'

const AddUsers = (props) => {
    const [users,setUsers] = useState([])
    const [user,setUser] = useState([])
    const [result,setResult] = useState([])
    
    
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

   

    const handleDelUser = (e)=>{

    }

    
    const handleAddGroup = ()=>{
        addUsers({variables:{
            id:props.project._id,
            users
        }})
    }

    if(!props.isOpen){
        return null
    }
    return <>
        <div className="overlay"></div>
        <div className="new-project add-users">
        <div className="stages users" >
            <div>
                <label>Users</label>
                <div className="list-stages">
                   {users.map(user => 
                        <div>
                            <span className="stage">{user.userName}</span>
                            <button onClick={(e)=>handleDelUser(e)} >-</button>
                        </div>
                    )}  
                             
                 </div>
                    <div ref={domNode} className="add-stages users-add">
                        <input ref={domNode} className="search-input" onKeyUp={(e)=>searchResult(e.target.value)} type="text" placeholder="Search for users with email" ></input>
                        <button onClick={()=>setUsers([...users,user])}>+</button> 
                        <div  className="search-result hide-search">
                                <ul>
                                    {data&&data.searchUsers.map(user => 
                                        <li value={user._id} onClick={(e)=>setUsers([...users,e.target.parentElement.attributes.value.value])}>
                                            <span>{user.userName}</span>
                                            <div>{user.email}</div>
                                        </li>    
                                    )}
                                </ul>
                            </div>
                    </div>
                        
                 </div>
            </div>
            <div className="add-project-btns" >
                    <button onClick={()=> handleAddGroup()} className="confirm" >Add Users</button>
                    <button onClick={props.close} className="cancel">Cancel</button>
            </div>
        </div>
            
        
    </>
}

export default AddUsers
