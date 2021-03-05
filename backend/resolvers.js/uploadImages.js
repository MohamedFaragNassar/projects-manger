const multer = require("multer")
const express = require("express")
const {isAuth} = require("../Authentication")


const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,"./media/")
    },
    filename: function(req,file,cb){
        cb(null,req.user._id+".jpg")
    }
})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png"){
       return  cb(null,true)
    }else{
        cb(new Error("file type error"),false)
    }

}



 const upload = multer({
    storage,
    fileFilter:function(req,file,cb){
        fileFilter(req,file,cb)
    },
    }) ;
    

    router.post("/many",isAuth,upload.array("images"),(req,res)=>{
        if(req.files){
            const files = req.files
            let fileNames = []
            for(let i=0;i<files.length;i++){
                fileNames.push(files[i].filename)
            }
            res.send(fileNames)
        }else{
            res.status(400).send("error in uploading the images")
        }
    })





router.post('/',isAuth, upload.single('image'), (req, res) => {
    if(req.file){
        res.json({"success":true})
    }else{
        res.status(400).send("error in uploading the image")
    }
    
  })


  
module.exports= router
  