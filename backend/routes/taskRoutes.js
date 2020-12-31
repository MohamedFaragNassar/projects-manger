const express = require('express')
const {isAuth} = require("../Authentication")
const {addTask} = require("../controllers/tasksController")
const router = express.Router()

router.route("/").post(isAuth,addTask)


module.exports= router;
