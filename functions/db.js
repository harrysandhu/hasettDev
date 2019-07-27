const HOST = "138.68.28.178"
const USER = "dazzler"
const PASSWORD = "@./%_1ab!dazzler" 
const DB = "hasettDev"
var mysql = require("mysql")



export var conn = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DB,
    charset : 'utf8mb4'
})

conn.connect(err => {
	if (err) console.log("Connection error!", err);
	else console.log("Connection successful");
});