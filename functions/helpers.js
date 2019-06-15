import { RESPONSES } from "./helperConstants";

import { conn } from "./db";
var mysql = require("mysql");

// conn.connect((err) =>{
//     if(err)
//         console.log("Connection error!", err)
//     else console.log("Connection successful")
// })

export function verifyAuthToken(req, res, next) {
	//get the auth header value
	const authToken = req.headers["authorization"];

	if (typeof authToken !== "undefined") {
		req.token = authToken;
		console.log(req.token);
		//next middleware
		next();
	} else {
		res.json({ error: "Unauthorized." });
	}
}

export function genRandomToken(seedText, length) {
	let chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
		seedText.toUpperCase() +
		"abcdefghijklmnopqrstuvwxyz" +
		seedText +
		"123456789";
	let charLength = chars.length;
	var result = "";
	for (var i = 0; i < length; i++) {
		result += chars[Math.floor(Math.random() * charLength)];
	}
	return result;
}

async function getRes(error, results, fields) {
	if (error) return RESPONSES.ERR_DB_CONNECTION;

	if (results.length === 0) return RESPONSES.EMAIL_AVAILABLE;
	else if (results.length > 0) return RESPONSES.EMAIL_UNAVAILABLE;
}

function emailAvailable() {
	return RESPONSES.EMAIL_AVAILABLE;
}
function emailUnavailable() {
	return RESPONSES.EMAIL_UNAVAILABLE;
}

export async function executeQuery(sql) {
	return new Promise((resolve, reject) => {
		conn.query(sql, (error, results, fields) => {
			if (error) reject(RESPONSES.ERR_DB_CONNECTION);

			resolve(results);
		});
	});
}

export async function checkEmailAddress(email) {
	const emailExpression = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (email.length < 4) {
		return RESPONSES.EMAIL_LENGTH;
	} else if (!emailExpression.test(email)) {
		return RESPONSES.EMAIL_FORMAT;
	}

	console.log(email);
	let sql = "SELECT email_address FROM ?? WHERE ?? = ?";
	let inserts = ["auth", "email_address", email];
	sql = mysql.format(sql, inserts);
	try {
		let mysqlQueryResponse = await executeQuery(sql);
		if (mysqlQueryResponse.length === 0) {
			return RESPONSES.EMAIL_AVAILABLE;
		} else if (mysqlQueryResponse.length > 0) {
			return RESPONSES.EMAIL_UNAVAILABLE;
		}
	} catch (e) {
		return e;
	}
}

export async function checkPassword(password) {
	let response = RESPONSES.PASSWORD_VALID;

	if (password.length < 8) {
		return RESPONSES.PASSWORD_LENGTH;
	}
	return response;
}
