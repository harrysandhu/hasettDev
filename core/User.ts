import UserInterface from './Interfaces/UserInterface';
import UserAuthData from './Interfaces/UserAuthData';
let jwt:any = require('jsonwebtoken')
let RESPONSES:any = require('../functions/helperConstants').RESPONSES;
import Result from './Result'
import Error from './Interfaces/Error'
import SResponse from './Interfaces/SResponse'
import InviteSResponse from './Interfaces/InviteSResponse'
import * as FS from "./settings/FieldSettings"
import {ERROR_RESPONSE} from './helper/ErrorResponse'
import {RESPONSE} from './helper/Response'

//get database connection instance
import {firepool} from './config/dbConfig'

 

export default class User {
    constructor(){}


    static async jwtVerifyUser(requestToken:string, publicKey:string): Promise<Result<UserAuthData, Error>>{
        let userData:UserAuthData = <UserAuthData>{}
        try{
             await jwt.verify(requestToken, publicKey, (error:any, authData:UserAuthData): any =>{
                
                if(error) throw error;
                  userData = authData;
            })
        } catch(e){
            console.log(e);
            return Promise.reject(Result.Failure(ERROR_RESPONSE.user.authException));
        }

        return Promise.resolve(Result.Success(userData))
    }

 

    /**	
    * Checks and validates username.
    * @param {string} username - username to check.
    * @optional @param {string} uId - u_id to check for, (When the user 
    has already selected it and wants to change the username)
    * ignores this u_id in sql query.
    * 
    */
    static async checkUsername(username:string, uId?:string): Promise<Result<SResponse, Error>> {
        //username settings from field settings
        let fs = FS.UsernameSettings
        //trim down spaces
        username = username.trim().toLowerCase();
        //check username length
        if(
            username.length < fs.minLength ||
            username.length > fs.maxLength
        ){
            return Promise.reject(Result.Failure(ERROR_RESPONSE.username.length))
        }else if(!fs.regex.test(username)){
            return Promise.reject(Result.Failure(ERROR_RESPONSE.username.format))
        }else{
            const client = await firepool.connect();
        
            try{
                if(!uId){
                    //query the database for username
                    await client.query('BEGIN');
                    let queryText = 'SELECT username FROM _user WHERE username= $1';
                    let res = await client.query(queryText, [username])
                    
                    //if found -> availability: false else true
                    if(res.rows.length == 0){
                        return Promise.resolve(Result.Success(RESPONSE.username.available))
                    }else{
                        return Promise.reject(Result.Failure(ERROR_RESPONSE.username.unavailable))
                    }

                }
                else if(uId){
                        //query the database for username where uId != arguments[1]
                    await client.query('BEGIN')
                    let queryText = 'SELECT username FROM _user WHERE username=$1 AND userId<>$2';
                    //if found -> availability : false else true
                    let res = await client.query(queryText, [username, uId])
                       if(res.rows.length == 0){
                        return Promise.resolve(Result.Success(RESPONSE.username.available))
                    }else{
                        return Promise.reject(Result.Failure(ERROR_RESPONSE.username.unavailable))
                        }
                } 
                else{
                    throw ERROR_RESPONSE.INVALID_REQUEST
                }       
            }catch(e){
                return Promise.reject(Result.Failure(ERROR_RESPONSE.username.unavailable))
            }finally{
                client.release();
            }
        }
    }


    /**	
    * Checks and validates email.
    * @param {string} email - email to check.
    * @optional @param {string} uId - u_id to check for, (When the user 
    has already selected it and wants to change the username)
    * ignores this u_id in sql query.
    * 
    */
    static async checkEmail(email:string, uId?:string): Promise<Result<SResponse, Error>> {
        //username settings from field settings
        let fs = FS.EmailSettings
        //trim down spaces
        email = email.trim().toLowerCase();
        //check username length
        if(
            email.length < fs.minLength ||
            email.length > fs.maxLength
        ){
            return Promise.reject(Result.Failure(ERROR_RESPONSE.email.invalid))
        }else if(!fs.regex.test(email)){
            return Promise.reject(Result.Failure(ERROR_RESPONSE.email.invalid))
        }else{
            const client = await firepool.connect();
        
            try{
                if(!uId){
                    //query the database for username
                    await client.query('BEGIN');
                    let queryText = 'SELECT emailaddress FROM _user WHERE emailaddress= $1';
                    let res = await client.query(queryText, [email])
                    
                    //if found -> availability: false else true
                    if(res.rows.length == 0){
                        return Promise.resolve(Result.Success(RESPONSE.email.valid))
                    }else{
                        return Promise.reject(Result.Failure(ERROR_RESPONSE.email.taken))
                    }

                }
                else if(uId){
                        //query the database for username where uId != arguments[1]
                    await client.query('BEGIN')
                    let queryText = 'SELECT emailaddress FROM _user WHERE emailaddress=$1 AND userId<>$2';
                    //if found -> availability : false else true
                    let res = await client.query(queryText, [email, uId])
                       if(res.rows.length == 0){
                        return Promise.resolve(Result.Success(RESPONSE.email.valid))
                    }else{
                        return Promise.reject(Result.Failure(ERROR_RESPONSE.email.taken))
                        }
                } 
                else{
                    throw ERROR_RESPONSE.INVALID_REQUEST
                }       
            }catch(e){
                return Promise.reject(Result.Failure(ERROR_RESPONSE.INVALID_REQUEST))
            }finally{
                // !IMPORTANT!
                client.release();
            }
        }
    }


    static async checkPhone(phone:string): Promise<Result<SResponse, Error>>{
        let fs = FS.PhoneNumberSettings;
        let phoneExp:any = /^[0-9]*$/;
        if(phone){
            if(phone.length != 11){
                return Promise.reject(Result.Failure(ERROR_RESPONSE.phoneNumber.invalid))
            }else if (!(phoneExp.test(phone))){
                return Promise.reject(Result.Failure(ERROR_RESPONSE.phoneNumber.invalid))
            }
            else{ 
                 const client = await firepool.connect();  
                try{
                   
                    await client.query('BEGIN')
                    let queryText = 'SELECT phone_number FROM _user WHERE phone_number=$1 AND phone_number_ext=$2';
                    let res = await client.query(queryText, [phone, "1"]);
                    if(res.rows.length == 0){
                        return Promise.resolve(Result.Success(RESPONSE.phoneNumber.valid))
                    }else{
                        return Promise.reject(Result.Failure(ERROR_RESPONSE.phoneNumber.taken))
                    }
                }catch(e){
                    console.log("error at checkphone", e)
                    return Promise.reject(Result.Failure(ERROR_RESPONSE.INVALID_REQUEST))
                }finally{
                    client.release();
                }
            }  
    }
     return Promise.reject(Result.Failure(ERROR_RESPONSE.phoneNumber.invalid))
    }

    /**
    * Checks and validates password.
    * @param {string} password - password to check
    * @return Result <SResponse, Error>
    */

    static async checkPassword(password:string) : Promise<Result<SResponse, Error>> {
        let fs = FS.PasswordSettings;
        if(password){
            if(password.length < fs.minLength || password.length > fs.maxLength)
                return Promise.reject(Result.Failure(ERROR_RESPONSE.password.length))
            else
                return Promise.resolve(Result.Success(RESPONSE.password.valid))

        }

         return Promise.reject(Result.Failure(ERROR_RESPONSE.INVALID_REQUEST))
    }




}