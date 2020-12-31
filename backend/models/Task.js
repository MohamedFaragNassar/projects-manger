const mongoose =require("mongoose")


const taskSchema = new mongoose.Schema({
    name:{type:String,required:true},
    start:{type:String},
    end:{type:String},
    duration:{type:Number},
    totalEffort:{type:Number},
    doneEffort:{type:Number},
    dependants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"task",
    }],
    dependsOn:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"task",
    }],
    assignedTo:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    }],
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    bucket:{type:String,},
    stage:{type:String,},
    completion:{type:Number,default:0}
})

taskSchema.pre('save', function() {
    if(this.start){
        this.start = this.start.toISOString("YYYY-MM-DD")
    }
    if(this.end){
        this.end = this.end.toISOString("YYYY-MM-DD")
    }
});


const Task = mongoose.model("Task",taskSchema)

module.exports = Task;