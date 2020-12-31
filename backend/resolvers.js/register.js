const User = require("../models/User")
const bcrypt = require("bcrypt")
const {getToken} = require("../Authentication")


const login = async (args) => {
   
        const signedUser = await User.findOne({email:args.email})
        if(signedUser){
            const auth = await bcrypt.compare(args.password, signedUser.password)
            if(auth){
               return{
                    id: signedUser._id,
                    userName: signedUser.userName,
                    fullName: signedUser.fullName,
                    email: signedUser.email,
                    token: getToken(signedUser)
                }
            }else{
                throw new Error("incorrect password")
            }
        }else{
            throw new Error("No account with this email")
        }
    
 }
 

 const register = async (args) =>{
        const passwordValidation= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,100}$/
        try{
            const checkEmail = await User.findOne({email:args.user.email})
            const checkUserName = await User.findOne({userName:args.user.userName})
            if(checkEmail){
                throw new Error("This Email is Already registered")
            }
            if(checkUserName){
                throw new Error("username already excist")
            }
            if(!args.user.password.match(passwordValidation)){
                throw new Error("password must be at least 8 charaters with contain at least one numeric digit, \
                one uppercase and one lowercase letter")
            }
            const newUser = new User(args.user)
            return newUser.save()
        }catch(error){
            throw new Error(error)
        }
}


const RigsterResolver = {login,register}

module.exports = RigsterResolver
