var express = require("express")
var api = express.Router()
var fs = require('fs')
var jwt = require('jsonwebtoken')
var crypto = require('crypto')
var sha256 = require('js-sha256')
var privateKey = fs.readFileSync('./security/private.key', 'utf8')
var publicKey = fs.readFileSync('./security/public.key', 'utf8')
var mysql = require("mysql")

import {verifyAuthToken} from '../functions/helpers'

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




api.get("/", verifyAuthToken, (req, res) =>{
    jwt.verify(req.token, publicKey, (err, authData) =>{
        if(err){
            return res.json({userAuthState: false})
        }else {
            return res.json({userAuthState: true})
        }
    })
})




api.get("/user", verifyAuthToken, (req, res) =>{
     jwt.verify(req.token, publicKey, (err, authData) =>{
        if(err){
            console.log(err)
            res.json({error : 'Unauthorized.', userAuthState: false})
        }else {
            console.log(authData)
            res.json({currentUser: authData})
        }
    })
})

api.get("/login", (req, res) =>{
    
    const username = "harrysandhu"
    const password = "9915081032"
    const emailAddress = "hrrsand@f.com"
    const salt = crypto.randomBytes(20).toString('hex');
    const passwordHash = sha256.hmac(salt, password)
    const uid = 432
    //put the shit in the database success and all that

    const payload  = {
        username : username,
        emailAddress : emailAddress,
        uid: uid,
        loginTime : Date.now()
    }

    var signOptions =  {
        subject: username,
        algorithm:  "RS256" 
    }
    var authToken = jwt.sign(payload, privateKey, signOptions)
    console.log("Generated Token: ", authToken)
    return res.json({
        status: 'LOGIN_SUCCESS',
        authToken : authToken
    })
})  



api.post("/post", verifyAuthToken, (req, res) =>{
    //get the auth data from the token
    jwt.verify(req.token, publicKey, (err, authData) =>{
        if(err){
            console.log(err)
            res.json({error : 'Unauthorized.'})
        }else {
            console.log(authData)
            res.json(authData)
        }
    })


})









module.exports = api