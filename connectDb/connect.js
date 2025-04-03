require('dotenv').config()
const mongoose = require('mongoose')
 const connect_String = process.env.connectionString


const connectDB = async ()=>{
    await mongoose.connect(connect_String)
    return console.log("Db Connected!!!")
}



module.exports = connectDB;