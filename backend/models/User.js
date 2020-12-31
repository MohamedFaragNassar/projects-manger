const mongoose =require("mongoose")
const bcrypt =require("bcrypt");

const userSchema = new mongoose.Schema({
    userName:{type:String,required:true,unique:true},
    fullName:{type:String,required:true},
    email:{type:String,required:true,unique:true,index:true},
    password:{type:String,required:true},
    image:{type:String},
    favorites:[{type:String}]
},{timestamps:true})

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt,)
    next();
} )


const User = mongoose.model("user",userSchema)

module.exports = User;