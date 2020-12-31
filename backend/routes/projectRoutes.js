const express = require('express')
const {isAuth} = require("../Authentication")
const {addProject,getProjects,getprojectdetails,deleteProject} = require('../controllers/projectController')

const router = express.Router()

router.route("/").get(isAuth,getProjects).post(isAuth,addProject)
router.route("/project/:id").get(isAuth,getprojectdetails).delete(isAuth,deleteProject)



module.exports= router;