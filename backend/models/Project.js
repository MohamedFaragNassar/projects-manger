const mongoose =require("mongoose")

const stageSchema = new mongoose.Schema({
    name:{type:String,required:true},
    order:{type:Number,required:true}
})


const projectschema = new mongoose.Schema({
    name:{type:String,required:true},
    buckets:[{type:String}],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        /* required:true, */
    },
    group:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    }],
    
},{timestamps:true})


const project = mongoose.model("project",projectschema)

module.exports = project;