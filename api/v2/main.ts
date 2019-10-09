
import express from 'express';
let main:any = express.Router();

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


main.get("/", verifyAuthToken, async (req:any, res:any) =>{
   try{
       
        let result = <Result<UserAuthData, Error>>await User.jwtVerifyUser(req.token, publicKey);
        if(result){
            return res.json(result.get())
        }
    }catch(error){
        return res.json(error.get())
    }
})


main.get("/validate/username", async (req: any, res:any) =>{
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

main.get("/validate/email", async (req: any, res:any) =>{
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

/**
* @method GET
* Gets the related categories to the query category keyword.
* @return CategoryResult ->  Category[]
 */ 
main.get("/category", async(req:any, res:any) =>{  
    if(!req.query.keyword) return res.json(ERROR_RESPONSE.INVALID_REQUEST)
    try{   
        let result = <Result<DBResult<CategoryInterface>, Error>>await Category.getRelatedCategories(req.query.keyword);
        if(result){
            return res.json(result.get())
        }
    }catch(error){
        console.log(error)
        return res.json(error)
    }
}) 


/**
* @method POST
* Gets the related categories to the query category keyword.
* @return CategoryResult ->  Category[]
 */ 
main.post("/category", async(req:any, res:any) => {
   if(!req.body.keyword) return res.json(ERROR_RESPONSE.INVALID_REQUEST)
    try{
        let result = <Result<DBResult<CategoryInterface>, Error>>await Category.createCategory(req.query.keyword);
        if(result){
            return res.json(result.get())
        }
    }catch(error){
        console.log(error)
        return res.json(error)
    }
})


/**
 * @method GET
 * Validates the phone number, generates a 5 digit code and sends an SMS.
 * @return PhoneVerification (type) the code, phone number, messageId.
  */
main.get("/phonenumbbercode", async(req: any, res:any) =>{
    if(!req.query.pn) return res.json(ERROR_RESPONSE.INVALID_REQUEST)
    try{
        let validateRes = <Result<SResponse, Error>>await User.validatePhone(req.query.pn);
        if(validateRes){
            let code:number = genVerificationCode();
            var params = {
                Message: "Your verification code: " + code,
                PhoneNumber: "+" + req.query.pn,
                  MessageAttributes: {
                'AWS.SNS.SMS.SenderID': {
                'DataType': 'String',
                'StringValue': "HDVerify1"
                }
            }
            }
             var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

    publishTextPromise.then(
        function (data) {
            res.end(JSON.stringify({ MessageID: data.MessageId, code : code, phoneNumber: req.query.pn }));
        })
        
        }

    }catch(error){
        console.log(error)
        return res.json(error)
    }
})

main.get("/sendSMS", async(req: any, res:any) =>{
    if(!req.query.pn) return res.json(ERROR_RESPONSE.INVALID_REQUEST)
    try{
        let validateRes = <Result<SResponse, Error>>await User.validatePhone(req.query.pn);
        if(validateRes){
           
            var params = {
                Message: req.query.message,
                PhoneNumber: "+" + req.query.pn,
                  MessageAttributes: {
                'AWS.SNS.SMS.SenderID': {
                'DataType': 'String',
                'StringValue': 'HDVerify1'
                }
            }
        }
        var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

    publishTextPromise.then(
        function (data) {
            res.end(JSON.stringify({ MessageID: data.MessageId, message : req.query.message, phoneNumber: req.query.pn }));
        })
        
        }

    }catch(error){
        console.log(error)
        return res.json(error)
    }
})





module.exports = main;