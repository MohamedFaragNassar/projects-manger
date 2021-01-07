const mongoose = require("mongoose")
const expresss = require("express")
const bodyParser = require("body-parser")
const {graphqlHTTP} = require('express-graphql');
const {schema} = require("./schemas/projectSchema")
const RootResolver = require("./resolvers.js/rootResolver")
const RigsterResolver = require("./resolvers.js/register")
const {userSchema} = require("./schemas/userSchema")
const cors = require('cors');
const {isAuth} = require("./Authentication")



const app = expresss("")
app.use(bodyParser.json());
app.use(cors());
app.use(expresss.static("public"))


app.use('/graphql',isAuth, graphqlHTTP((req)=>({
    schema,
    rootValue:RootResolver,
    graphiql:true,
    context:{user:req.user}
})));
app.use('/api', graphqlHTTP({
        schema: userSchema,
        rootValue:RigsterResolver,
        graphiql: true
    }));
    

const mongoDB_URl = "mongodb://127.0.0.1:27017/project_manger";
const port = process.env.port || 5000;

mongoose.connect(mongoDB_URl,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true},) 
        .then(app.listen(port,()=>{console.log("server connected")}))
        .catch(err => console.log(err))