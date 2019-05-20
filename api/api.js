var express = require("express")
var api = express.Router()


var mysql = require("mysql")

const HOST = "localhost"
const USER = "root"
const PASSWORD = "Harry1032."
const DB = "hasettDev"

var conn = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DB
})



conn.connect((err) =>{
    console.log("Connection error!", err)
})





api.get("/users", (req, res) =>{

})



module.exports = api