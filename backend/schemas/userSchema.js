const {buildSchema} = require('graphql');
const _ = require("lodash")
const Project = require("../models/Project")
const User = require("../models/User")
const bcrypt = require("bcrypt")
const {getToken} = require("../Authentication");
const project = require('../models/Project');
const  {projectType} = require( './projectSchema')


const userSchema = buildSchema(`
type loginType {
    id:String
    userName:String
    fullName:String
    email:String
    token:String
}

type userType {
    _id:String
    userName:String
    fullName:String
    email:String
    password:String
    image:String
    favorites:[String]
}

input userInput {
    userName:String
    fullName:String
    email:String
    password:String
}

type RootQuery {
    users : String
}

type Mutation {
    login(email:String,password:String): loginType
    register(user:userInput!):userType
}

schema {
   query: RootQuery
   mutation: Mutation
}

`)




module.exports = {
    userSchema
}