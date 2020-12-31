const dotenv = require("dotenv")

dotenv.config();

module.exports =  {
    PORT : process.env.PORT || 5000,
    MONGODB_URL : process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/project_manger",
    JWT_SECRET : process.env.JWT_SECRET || "somthing secret"
}