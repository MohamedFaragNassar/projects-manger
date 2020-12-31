const Project =  require("../models/Project")



const getProjects = async(req,res)=>{
    const owner = req.user;
    try{
        const projects = await Project.find({owner})
        if(projects){
            res.send(projects)
        }
    }catch(error){
        console.log(error)
        res.status(500).send("somthing went wrong when trying to get projects")
    }
}

const addProject = async(req,res)=>{
    const {name,stages,buckets} = req.body
    const owner = req.user

   
    try{
        const project = new Project({
            name,
            stages,
            buckets,
            owner,
        })
        const newProject = await project.save()
        if(newProject){
            res.send(newProject)
        }
    }catch(error){
        console.log(error)
        res.status(500).send("somthing went wrong when trying to add new project")
    }
}


const getprojectdetails = async(req,res) => {
    const id = req.params.id
    if(id){
        try{
            const project = await Project.findById(id)
            if(project){
                res.send(project)
            }else{
                res.status(404).send("no project with this id")
            }
    
        }catch(error){
            console.log(error)
            res.status(500).send("somthing went wrong when trying to add new project")
        }
    }else{
        res.status(400).send("No Id was provided")
    }
}

const deleteProject = async(req,res) => {
    const id = req.params.id;
    if(id){
        try{
            const project = await Project.findByIdAndDelete(id)
            if(project){
                res.send("success")
            }else{
                res.status(404).send("no project with this id")
            }
    
        }catch(error){
            console.log(error)
            res.status(500).send("somthing went wrong when trying to delete the project")
        }
    }else{
        res.status(400).send("No Id was provided")
    }
}

module.exports = {
    addProject,getProjects,getprojectdetails,deleteProject
}