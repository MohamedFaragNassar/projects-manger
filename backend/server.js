const mongoose = require("mongoose")
const express = require("express")
const bodyParser = require("body-parser")
const {graphqlHTTP} = require('express-graphql');
const schema= require("./schemas/projectSchema")
const RootResolver = require("./resolvers.js/rootResolver")
const RigsterResolver = require("./resolvers.js/register")
const {userSchema} = require("./schemas/userSchema")
const cors = require('cors');
const {isAuth} = require("./Authentication")
const uploadRoute = require("./resolvers.js/uploadImages")


const app = express("")
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"))
app.use(express.static("media"))



app.use('/graphql',isAuth, graphqlHTTP((req)=>({
    schema,
    graphiql:true,
    context:{user:req.user}
})));
app.use('/api', graphqlHTTP({
        schema: userSchema,
        rootValue:RigsterResolver,
        graphiql: true
    }));
app.use("/upload",uploadRoute)
    

const mongoDB_URl = "mongodb://127.0.0.1:27017/project_manger";
const port = process.env.port || 5000;

mongoose.connect(mongoDB_URl,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true},) 
        .then(app.listen(port,()=>{console.log("server connected")}))
        .catch(err => console.log(err))