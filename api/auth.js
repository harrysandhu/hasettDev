var express = require("express")
var auth = express.Router()
var fs = require('fs')
var jwt = require('jsonwebtoken')
var crypto = require('crypto')
var sha256 = require('js-sha256')
var privateKey = fs.readFileSync('./security/private.key', 'utf8')
var publicKey = fs.readFileSync('./security/public.key', 'utf8')
var mysql = require("mysql")

import {verifyAuthToken} from '../helperFunctions/auth'

const HOST = "138.68.28.178"
const USER = "dazzler"
const PASSWORD = "@./%_1ab!dazzler" 
const DB = "hasettDev"


var conn = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DB
})


conn.connect((err) =>{
    if(err)
        console.log("Connection error!", err)
    else console.log("Connection successful")
})




auth.get("/check_email_address", (req, res) =>{

    if(!req.query.hasOwnProperty("email")){
        return res.json({
                errorStatus: true, 
                errorCode: "ERROR/INVALID_REQUEST",
                errorMessage: "Invalid request."
        })
    }
    

    let email = req.query.email
    const emailExpression = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(email.length < 4){
        return res.json({
                errorStatus: true, 
                errorCode: "ERROR/EMAIL_LENGTH",
                errorMessage: "Invalid email address"
            })
    }
    else if(!(emailExpression.test(email))){
        return  res.json({
                errorStatus: true, 
                errorCode: "ERROR/EMAIL_INVALID",
                errorMessage: "Invalid email address"
            })
    }

    console.log(email)    
    let sql = "SELECT * FROM ?? WHERE ?? = ?";
    let inserts = ["auth", "email_address", email ]
    sql = mysql.format(sql, inserts)

    conn.query(sql, (error, result, fields) =>{
        if(error){
            console.log(error)
            return ({
                errorStatus: true, 
                errorCode: "ERROR/DB",
                errorMessage: "Something went wrong!"
            })
        }
        if(result.length === 0){
            //username is available
             res.json({
                errorStatus: false,
                emailStatus: true
            })
        }else if(result.length > 0){
            res.json({
                errorStatus: false,
                emailStatus: false
            })
        }

    })


})






module.exports = auth