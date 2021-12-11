import { gql } from '@apollo/client';

const loginQuery = gql`
   mutation login($email: String, $password: String){
       login(email:$email,password:$password){
           id
           userName
           fullName
           email
           token
       }
       
   }
`

const registerUserMutation = gql`
mutation register($user:userInput!){
    register(user:$user){
        _id
    }
}
`

const searchUsersQuery = gql`
   query searchUsers($keyword:String!){
        searchUsers(keyword:$keyword){
            _id
            userName
            email
        }
   }
`



export{
    loginQuery,searchUsersQuery,registerUserMutation
}