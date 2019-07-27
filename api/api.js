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




api.get("/user", verifyAuthToken, async (req, res) =>{
    try{
        let currentUser = await jwtVerifyUser(req.token, publicKey)
        console.log(currentUser)
        //get user data and merge into currentUser object
        let currentUserDataSQL = "SELECT * FROM ?? WHERE ?? = ?";
        let currentUserDataInserts = ["users", "u_id", currentUser.u_id]

        currentUserDataSQL = mysql.format(currentUserDataSQL, currentUserDataInserts)
        let currentUserDataResult = await executeQuery(currentUserDataSQL)
        let currentUserData = currentUserDataResult[0]
        currentUser = {...currentUser, ...currentUserData}
        return res.json(currentUser)

    }catch(e){
        if(e.errorStatus){
            console.log("Error at GET /user", e)
            return res.json(e)
        }
        return res.json(RESPONSES.ERR_SYSTEM)
        

    }
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
        let currentUser  = await jwtVerifyUser(req.token, publicKey)
        console.log(currentUser)

        if(!req.body.hasOwnProperty('userData')){
            throw RESPONSES.INVALID_REQUEST
        }else if(!req.body.userData.hasOwnProperty("name") ||
                !req.body.userData.hasOwnProperty("username") ||
                !req.body.userData.hasOwnProperty("userDescription") ||
                !req.body.userData.hasOwnProperty("profilePictureImageData") ||
                !req.body.userData.hasOwnProperty("profilePictureIsSelected")
                ) {
            throw RESPONSES.INVALID_REQUEST
        }
        let {userData} = req.body

        //Default profile picture data
        let cryptFilename = 'defaultProfilePicture.jpg'
        let profilePictureURI = BASE_DEV + "defaultUser/profile/" + cryptFilename

        if(userData.profilePictureIsSelected){
            //filename made of psuedorandom characters
            cryptFilename = crypto.randomBytes(10).toString('hex')
            //save profile picture
            
            //URI in the form of  https://truffen.com/yada/yada.jpg
            //MUTATE profilePictureURI
            profilePictureURI = await saveImage(currentUser.u_id, cryptFilename, userData.profilePictureImageData) 
        }
        await checkUsername(userData.username, currentUser.u_id)
         let authSQL = "UPDATE auth SET ? WHERE auth_id = ?"
            let usernameInsert = {username: userData.username}
            let authInserts = [usernameInsert, currentUser.auth_id]
        authSQL = mysql.format(authSQL, authInserts)
        console.log(authSQL)
        let authQueryResponse = await executeQuery(authSQL)
        console.log(authQueryResponse)
        let userSQL = "UPDATE users SET ? WHERE ?? = ?"
         let userDataInserts = {
                name: userData.name,
                username: userData.username,
                userDescription: userData.userDescription,
                profilePictureURI: profilePictureURI,
                profilePictureFilename: cryptFilename
            }
            let userInserts = [userDataInserts, 'u_id', currentUser.u_id]
            userSQL = mysql.format(userSQL, userInserts)


            let userDataQueryResponse = await executeQuery(userSQL)
            return res.json(RESPONSES.SUCCESS)


    }catch(e){
        //e will a "RESPONSE Object"
        console.log(new Error().stack.split(/\r\n|\r|\n/g)[1].trim(), e)
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