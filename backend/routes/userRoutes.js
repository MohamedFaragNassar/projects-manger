const express = require('express')
const { isAuth } = require('../Authentication')
const {registerUser,getAllUsers,signin,searchUser} = require("../controllers/userController")
const router = express.Router()


router.route("/").post(registerUser).get(getAllUsers)
router.post("/signin",signin)
router.get("/search",isAuth,searchUser)

module.exports= router;
 