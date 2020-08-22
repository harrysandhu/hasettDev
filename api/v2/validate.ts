
import express from 'express';
let validate:any = express.Router();

let fs:any = require('fs')
let jwt:any = require('jsonwebtoken')
let crypto:any = require('crypto')
let sha256:any = require('js-sha256')
let privateKey:any = fs.readFileSync('./security/private.key', 'utf8')
let publicKey:any = fs.readFileSync('./security/public.key', 'utf8')
let mysql:any = require("mysql")

let verifyAuthToken:any = require('../../functions/helpers').verifyAuthToken;
let genVerificationCode:any = require('../../functions/helpers').genVerificationCode;
let RESPONSES:any = require('../../functions/helperConstants').RESPONSES;
let BASE_DEV:any = require('../../functions/helperConstants').BASE_DEV;

import User from '../../core/User'
import UserAuthData from '../../core/Interfaces/UserAuthData'
import Error from '../../core/Interfaces/Error'
import Result from '../../core/Result'
import SResponse from '../../core/Interfaces/SResponse'
import CategoryResult from '../../core/Interfaces/CategoryResult'
import DBResult from '../../core/Interfaces/DBResult'
import Category from '../../core/Category'
import CategoryInterface  from '../../core/Category'
import {ERROR_RESPONSE} from '../../core/helper/ErrorResponse'
import {RESPONSE} from '../../core/helper/Response'
import AWS from 'aws-sdk';
require('dotenv').config();



validate.get("/username", async (req: any, res:any) =>{
    //validate request
    if(!req.query.username) return res.json(ERROR_RESPONSE.INVALID_REQUEST);
    else {

        //determine query params
         let username:string, uId:any = null;
         if(req.query.uId) uId = req.query.uId;
         username = req.query.username;
        
        //checkUsername
         try{
             let result = <Result<SResponse, Error>>await User.checkUsername(username, uId)
             if(result) return res.json(result.get())
         }catch(error){
             return res.json(error.get())
         }
    }  
})



validate.get("/email", async (req: any, res:any) =>{
    //validate request
    if(!req.query.email) return res.json(ERROR_RESPONSE.INVALID_REQUEST);
    else {

        //determine query params
         let email:string, uId:any = null;
         if(req.query.uId) uId = req.query.uId;
         email = req.query.email;
        
        //checkUsername
         try{
             let result = <Result<SResponse, Error>>await User.checkEmail(email, uId)
             if(result) return res.json(result.get())
         }catch(error){
             return res.json(error.get())
         }
    }  
})



validate.get("/phone", async (req:any, res:any) =>{

    //validate request
    if(!req.query.phone) return res.json(ERROR_RESPONSE.INVALID_REQUEST)
    else{

        //determine query params
        let phone:string = req.query.phone;
        try{
            let result = <Result<SResponse, Error>>await User.checkPhone(phone);
            if(result) return res.json(result.get())
        }catch(error){
            return res.json(error.get());
        }
    }
})


module.exports = validate;