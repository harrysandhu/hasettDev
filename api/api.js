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
import { RESPONSES, BASE_DEV } from "../functions/helperConstants";

const HOST = "138.68.28.178"
const USER = "dazzler"
const PASSWORD = "@./%_1ab!dazzler" 
const DB = "hasettDev"

import {
	genRandomToken,
	checkEmailAddress,
	checkPassword,
    checkUsername,
	executeQuery,
    jwtVerifyUser
} from "../functions/helpers";

import {
    saveImage
} from "../functions/fileFunctions"


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


api.post("/user_data", verifyAuthToken, async (req, res) =>{
    try{
        //verify jwt token and get the currentUser
        let currentUser = await jwtVerifyUser(req.token, publicKey)

        //destructure currentUser
        let {
            auth_id,
            u_id,
            email_address
        } = currentUser
        
        //Check if the currentUser has 'userData'. 
        //userData would have a contract of the fields below.
        if(!req.body.hasOwnProperty('userData')){
            throw RESPONSES.INVALID_REQUEST
        }
        //userData needs to have the following fields.
        let {
            nameTF,
            usernameTF,
            userDescriptionTF,
            profilePictureImageData,
            profilePictureIsSelected
        } = req.body.userData
        
        // 
        let profilePictureURI = BASE_DEV + "/defaultUser/profile/" + 'defaultProfilePicture.jpg' 
        let cryptFilename = 'defaultProfilePicture.jpg'
        if(profilePictureIsSelected){
             cryptFilename = crypto.randomBytes(10).toString('hex')

            let profilePictureURI_RESPONSE = await saveImage(u_id, cryptFilename, profilePictureImageData)

            console.log(profilePictureURI_RESPONSE)
            if(profilePictureURI_RESPONSE.errorStatus){
                return profilePictureURI_RESPONSE
            }else{
                profilePictureURI = profilePictureURI_RESPONSE.imageURI
            }

        }

        let checkUsername_RESPONSE = await checkUsername(usernameTF, u_id)

            //---------LOG---------

        if(!checkUsername_RESPONSE.usernameStatus){
                throw checkUsername_RESPONSE
        }

        let authSQL = "UPDATE auth SET ? WHERE auth_id = ?"
            let usernameInsert = {username: usernameTF}
            let authInserts = [usernameInsert, auth_id]
        authSQL = mysql.format(authSQL, authInserts)
        console.log(authSQL)
        let authQueryResponse = await executeQuery(authSQL)
        console.log(authQueryResponse)
        let userSQL = "UPDATE users SET ? WHERE ?? = ?"
         let userDataInserts = {
                name: nameTF,
                username: usernameTF,
                userDescription: userDescriptionTF,
                profilePictureURI: profilePictureURI,
                profilePictureFilename: cryptFilename
            }
            let userInserts = [userDataInserts, 'u_id', u_id]
            userSQL = mysql.format(userSQL, userInserts)


            let userDataQueryResponse = await executeQuery(userSQL)
            return res.json(RESPONSES.SUCCESS)


    }catch(e){
        console.log(e)
        return res.json(e)
    }
    
})







// api.post("/user_data", verifyAuthToken, async function (req, res) {
//     jwt.verify(req.token, publicKey, async (err, currentUser) =>{
//         if(err) res.json(RESPONSES.USER_UNAUTHORIZED)
//         let { auth_id, 
//             u_id, 
//             email_address
//             } = currentUser

        
//         //get userData
//         if(!req.body.hasOwnProperty('userData')){
//             return res.json(RESPONSES.INVALID_REQUEST)
//         }

//         try{
//             let {
//                 nameTF,
//             usernameTF,
//             userDescriptionTF,
//             profilePictureImageData,
//             profilePictureIsSelected
//             } = req.body.userData


//             if(profilePictureIsSelected){
//                 //convert profilePictureImageData into jpg file and get path name
//                 let cryptFilename = crypto.randomBytes(10).toString('hex')

//                 let profilePictureURI_RESPONSE = await saveImage(u_id, cryptFilename, profilePictureImageData)

//                 if(profilePictureURI_RESPONSE.errorStatus){
//                     return profilePictureURI_RESPONSE
//                 }
//             }

//             let checkUsername_RESPONSE = await checkUsername(username)

//             //---------LOG---------

//             if(!checkEmailAddress_RESPONSE.usernameStatus){
//                 return RESPONSES.USERNAME_UNAVAILABLE
//             }


//             let authSQL = "INSERT INTO auth SET ? WHERE ?? = ?"
//             let usernameInsert = {username}
//             let authInserts = [usernameInsert, "auth_id", auth_id]
            
//             authSQL = mysql.format(authSQL, authInserts)

//             let authQueryResponse = await executeQuery(authSQL)
            
//             let userSQL = "INSERT INTO users SET ? WHERE ?? = ?"
//             let userDataInserts = {
//                 name: nameTF,
//                 username: usernameTF,
//                 userDescription: userDescriptionTF,
//                 profilePictureURI: profilePictureURI,
//                 profilePictureFilename: cryptFilename
//             }
//             let userInserts = [userDataInserts, 'u_id', u_id]
//             userSQL = mysql.format(userSQL, userInserts)

//             let userDataQueryResponse = await executeQuery(userSQL)

//             return res.json(RESPONSES.SUCCESS)

            

//         }catch(e){
//             return res.json(RESPONSES.ERR_SYSTEM)
//         }


//         //update userData - user
//         //update username - auth
        
        
//     })
// })








module.exports = api