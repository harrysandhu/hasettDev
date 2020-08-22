import UserInterface from './Interfaces/UserInterface';
import UserAuthData from './Interfaces/UserAuthData';
let jwt:any = require('jsonwebtoken')
let RESPONSES:any = require('../functions/helperConstants').RESPONSES;
import Result from './Result'
import Error from './Interfaces/Error'
import SResponse from './Interfaces/SResponse'
import CategoryResult from './Interfaces/CategoryResult'
import * as FS from "./settings/FieldSettings"
import {firepool} from './config/dbConfig'
import {ERROR_RESPONSE} from './helper/ErrorResponse'
import {RESPONSE} from './helper/Response'
import User from './User'


export default class BusinessUser extends User{
    constructor(){
        super();
    }

  
}
