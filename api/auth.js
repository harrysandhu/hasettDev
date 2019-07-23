var express = require("express");
var auth = express.Router();
var fs = require("fs");
var jwt = require("jsonwebtoken");
var crypto = require("crypto");
var sha256 = require("js-sha256");
var privateKey = fs.readFileSync("./security/private.key", "utf8");
var publicKey = fs.readFileSync("./security/public.key", "utf8");
var mysql = require("mysql");
import { conn } from "../functions/db";
import { RESPONSES } from "../functions/helperConstants";
const https = require("https");

//Helper Function Imports
import {
	verifyAuthToken,
	genRandomToken,
	checkEmailAddress,
	checkUsername,
	checkPassword,
	executeQuery
} from "../functions/helpers";

/**
**** JWT INSTRUCTIONS
	 userAuthPayload = {
	auth_id,
	u_id,
	email_address,
	signup_datetime
}
 */

/**
* METHOD: GET
* REQUEST PARAMS: @param {String} email
* Checks the email address validity.
* @returns {Object} RESPONSE.
*/
auth.get("/check_email_address", async function(req, res) {
	if (!req.query.hasOwnProperty("email")) {
		return res.json(RESPONSES.INVALID_REQUEST);
	}
	let email = req.query.email;
	try {
		let checkEmailAddress_RESPONSE = await checkEmailAddress(email);
		return res.json(checkEmailAddress_RESPONSE);
	} catch (e) {
		console.log(e)
		return res.json(RESPONSES.ERR_SYSTEM);
	}
});



/**
* METHOD: GET,
* REQUEST PARAMS @param {String} username
* checks the username availability
* @returns {Object} RESPONSE

 */
auth.get("/check_username", async function(req, res){
	if(!req.query.hasOwnProperty('username')) {
		return res.json(RESPONSES.INVALID_REQUEST)
	}
	let username = req.query.username
	try{
		let checkUsername_RESPONSE = await checkUsername(username)
		return res.json(checkUsername_RESPONSE)
	}catch(e){
		return res.json(e)
	}
})



/**
* METHOD: POST
* REQUEST PARAMS: @param {String} email
*				  @param {String} password
* Validates email and password,
* Generates random salt, auth_id, u_id and password_hash.
* username default value = ''.
* Inserts data into `auth` table {	auth_id, 
									u_id, 
									username, 
									password_hash, 
									email_address, 
									salt
								 }.
* @returns {Object} -> {authToken, errorStatus: false} RESPONSE, user data object if successful, 
	error Object on fail.
*/
auth.post("/signup", async function(req, res) {

	//check if request body params exist
	if (
		!req.body.hasOwnProperty("email") ||
		!req.body.hasOwnProperty("password")
	) {
		return res.json(RESPONSES.INVALID_REQUEST);
	}

	//prepare all the fields
	let email = req.body.email;
	let password = req.body.password;
	let salt = crypto.randomBytes(20).toString('hex')
	let password_hash = sha256.hmac(salt, password);
	let auth_id = sha256.hmac(salt, genRandomToken(email.split("@")[0], 11));
	let u_id = sha256.hmac(salt, genRandomToken(email.split("@")[0], 11));


	
	try {
		//check email address
		let checkEmailAddress_RESPONSE = await checkEmailAddress(email);
		//check password
		let checkPassword_RESPONSE = await checkPassword(password);
		
		//--------LOG-------//
		console.log(checkEmailAddress_RESPONSE);
		console.log(checkPassword_RESPONSE);


		// if emailStatus and passwordStatus are true
		if (
			!checkEmailAddress_RESPONSE.errorStatus &&
			!checkPassword_RESPONSE.errorStatus
		) {
			

			//////////////////
			//`auth` table//
			/////////////////
			let sql = "INSERT INTO auth SET ?";

			//sql inserts
			let inserts = {
				auth_id: auth_id,
				u_id: u_id,
				username: [email].toString(),
				password_hash: password_hash,
				email_address: [email].toString(),
				salt: salt
			};

			//prepare sql statement
			sql = mysql.format(sql, inserts);
			


			//////////////////
			//`users` table//
			/////////////////
			let usersTableSQL = "INSERT INTO users SET ?";

			//sql inserts
			let usersInserts = {
				u_id: u_id,
				email_address: [email].toString(),
				username: [email].toString()
			}

			//prepare sql statement
			usersTableSQL = mysql.format(usersTableSQL, usersInserts)

			//get current user, by u_id
			let getCurrentUserDataSQL = "SELECT u_id, email_address, signup_datetime FROM ?? WHERE ?? = ?"

			
			//current users inserts
			let getCurrentUserInserts = ["users", 'u_id', u_id]

			
			//prepare sql statement
			getCurrentUserDataSQL = mysql.format(getCurrentUserDataSQL, getCurrentUserInserts)

			
			try {
				//insert into auth response
				let mysqlQueryResponse = await executeQuery(sql);
				//insert into users response
				let usersMysqlQueryResponse = await executeQuery(usersTableSQL)
				//select from users, the current user
				let getCurrentUserResponse = await executeQuery(getCurrentUserDataSQL)


				//initialize userAuthPayload response
				let userAuthPayload = {
					auth_id,
					u_id,
					email_address: email
				}


				
				//TODO: jwt sign options
				let signOptions = {	
					subject: u_id,
					algorithm: "RS256"
				}


				//Create the jwt authToken using userAuthPayload
				let authToken = jwt.sign(userAuthPayload, privateKey, signOptions)

				
				//--------LOG-------//
				console.log(authToken)
				console.log(userAuthPayload)
				
				//SUCCESS response object
				let successResponse = {
					errorStatus: false,
					authToken : authToken,
				}
				return res.json(successResponse);
			} catch (e) {
				console.log(e)
				//e -> comes from the async helper functions, on error -> errorStatus is true
				return res.json(e);
			}
		} else {
			return res.json(RESPONSES.INVALID_REQUEST);
		}
	} catch (e) {
		console.log(e);
		return res.json(RESPONSES.ERR_SYSTEM);
	}
});


// api.post("/login", (req, res) =>{

// 	if(!req.body.hasOwnProperty('user_public'))
// })


module.exports = auth;

























