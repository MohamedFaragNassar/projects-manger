const { request } = require("express")
const Project =  require("../models/Project")

const addTask = async (req,res)=> {
    console.log(req.body)
    const id = req.body.id;
    const task = req.body.task 
    try{
        const project = await Project.findById(id)
        if(project){
            project.tasks.push(task);
            const updatedProject = await project.save();
            if(updatedProject){
                res.send("success")
            }
        }else{
            res.status(404).send("no project with this id")
        } 
    }catch(error){
        console.log(error)
        res.status(500).send("somthing went wrong when trying to add new task")
    }
}

module.exports={
    addTask
}