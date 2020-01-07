"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require('jsonwebtoken');
var RESPONSES = require('../functions/helperConstants').RESPONSES;
var Result_1 = __importDefault(require("./Result"));
var FS = __importStar(require("./settings/FieldSettings"));
var ErrorResponse_1 = require("./helper/ErrorResponse");
var Response_1 = require("./helper/Response");
//get database connection instance
var dbConfig_1 = require("./config/dbConfig");
var User = /** @class */ (function () {
    function User() {
    }
    User.jwtVerifyUser = function (requestToken, publicKey) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userData = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, jwt.verify(requestToken, publicKey, function (error, authData) {
                                if (error)
                                    throw error;
                                userData = authData;
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.user.authException))];
                    case 4: return [2 /*return*/, Promise.resolve(Result_1.default.Success(userData))];
                }
            });
        });
    };
    /**
    * Checks and validates username.
    * @param {string} username - username to check.
    * @optional @param {string} uId - u_id to check for, (When the user
    has already selected it and wants to change the username)
    * ignores this u_id in sql query.
    *
    */
    User.checkUsername = function (username, uId) {
        return __awaiter(this, void 0, void 0, function () {
            var fs, client, queryText, res, queryText, res, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fs = FS.UsernameSettings;
                        //trim down spaces
                        username = username.trim().toLowerCase();
                        if (!(username.length < fs.minLength ||
                            username.length > fs.maxLength)) return [3 /*break*/, 1];
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.username.length))];
                    case 1:
                        if (!!fs.regex.test(username)) return [3 /*break*/, 2];
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.username.format))];
                    case 2: return [4 /*yield*/, dbConfig_1.firepool.connect()];
                    case 3:
                        client = _a.sent();
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 12, 13, 14]);
                        if (!!uId) return [3 /*break*/, 7];
                        //query the database for username
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 5:
                        //query the database for username
                        _a.sent();
                        queryText = 'SELECT username FROM _user WHERE username= $1';
                        return [4 /*yield*/, client.query(queryText, [username])
                            //if found -> availability: false else true
                        ];
                    case 6:
                        res = _a.sent();
                        //if found -> availability: false else true
                        if (res.rows.length == 0) {
                            return [2 /*return*/, Promise.resolve(Result_1.default.Success(Response_1.RESPONSE.username.available))];
                        }
                        else {
                            return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.username.unavailable))];
                        }
                        return [3 /*break*/, 11];
                    case 7:
                        if (!uId) return [3 /*break*/, 10];
                        //query the database for username where uId != arguments[1]
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 8:
                        //query the database for username where uId != arguments[1]
                        _a.sent();
                        queryText = 'SELECT username FROM _user WHERE username=$1 AND userId<>$2';
                        return [4 /*yield*/, client.query(queryText, [username, uId])];
                    case 9:
                        res = _a.sent();
                        if (res.rows.length == 0) {
                            return [2 /*return*/, Promise.resolve(Result_1.default.Success(Response_1.RESPONSE.username.available))];
                        }
                        else {
                            return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.username.unavailable))];
                        }
                        return [3 /*break*/, 11];
                    case 10: throw ErrorResponse_1.ERROR_RESPONSE.INVALID_REQUEST;
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        e_2 = _a.sent();
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.username.unavailable))];
                    case 13:
                        client.release();
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Checks and validates email.
    * @param {string} email - email to check.
    * @optional @param {string} uId - u_id to check for, (When the user
    has already selected it and wants to change the username)
    * ignores this u_id in sql query.
    *
    */
    User.checkEmail = function (email, uId) {
        return __awaiter(this, void 0, void 0, function () {
            var fs, client, queryText, res, queryText, res, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fs = FS.EmailSettings;
                        //trim down spaces
                        email = email.trim().toLowerCase();
                        if (!(email.length < fs.minLength ||
                            email.length > fs.maxLength)) return [3 /*break*/, 1];
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.email.invalid))];
                    case 1:
                        if (!!fs.regex.test(email)) return [3 /*break*/, 2];
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.email.invalid))];
                    case 2: return [4 /*yield*/, dbConfig_1.firepool.connect()];
                    case 3:
                        client = _a.sent();
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 12, 13, 14]);
                        if (!!uId) return [3 /*break*/, 7];
                        //query the database for username
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 5:
                        //query the database for username
                        _a.sent();
                        queryText = 'SELECT emailaddress FROM _user WHERE emailaddress= $1';
                        return [4 /*yield*/, client.query(queryText, [email])
                            //if found -> availability: false else true
                        ];
                    case 6:
                        res = _a.sent();
                        //if found -> availability: false else true
                        if (res.rows.length == 0) {
                            return [2 /*return*/, Promise.resolve(Result_1.default.Success(Response_1.RESPONSE.email.valid))];
                        }
                        else {
                            return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.email.taken))];
                        }
                        return [3 /*break*/, 11];
                    case 7:
                        if (!uId) return [3 /*break*/, 10];
                        //query the database for username where uId != arguments[1]
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 8:
                        //query the database for username where uId != arguments[1]
                        _a.sent();
                        queryText = 'SELECT emailaddress FROM _user WHERE emailaddress=$1 AND userId<>$2';
                        return [4 /*yield*/, client.query(queryText, [email, uId])];
                    case 9:
                        res = _a.sent();
                        if (res.rows.length == 0) {
                            return [2 /*return*/, Promise.resolve(Result_1.default.Success(Response_1.RESPONSE.email.valid))];
                        }
                        else {
                            return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.email.taken))];
                        }
                        return [3 /*break*/, 11];
                    case 10: throw ErrorResponse_1.ERROR_RESPONSE.INVALID_REQUEST;
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        e_3 = _a.sent();
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.INVALID_REQUEST))];
                    case 13:
                        // !IMPORTANT!
                        client.release();
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    User.checkPhone = function (phone) {
        return __awaiter(this, void 0, void 0, function () {
            var fs, phoneExp, client, queryText, res, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fs = FS.PhoneNumberSettings;
                        phoneExp = /^[0-9]*$/;
                        if (!phone) return [3 /*break*/, 9];
                        if (!(phone.length != 11)) return [3 /*break*/, 1];
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.phoneNumber.invalid))];
                    case 1:
                        if (!!(phoneExp.test(phone))) return [3 /*break*/, 2];
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.phoneNumber.invalid))];
                    case 2: return [4 /*yield*/, dbConfig_1.firepool.connect()];
                    case 3:
                        client = _a.sent();
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 7, 8, 9]);
                        return [4 /*yield*/, client.query('BEGIN')];
                    case 5:
                        _a.sent();
                        queryText = 'SELECT phone FROM _user WHERE phone_number=$1 AND phone_number_ext=$2';
                        return [4 /*yield*/, client.query(queryText, [phone, "1"])];
                    case 6:
                        res = _a.sent();
                        if (res.rows.length == 0) {
                            return [2 /*return*/, Promise.resolve(Result_1.default.Success(Response_1.RESPONSE.phoneNumber.valid))];
                        }
                        else {
                            return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.phoneNumber.taken))];
                        }
                        return [3 /*break*/, 9];
                    case 7:
                        e_4 = _a.sent();
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.INVALID_REQUEST))];
                    case 8:
                        client.release();
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.phoneNumber.invalid))];
                }
            });
        });
    };
    /**
    * Checks and validates password.
    * @param {string} password - password to check
    * @return Result <SResponse, Error>
    */
    User.checkPassword = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var fs;
            return __generator(this, function (_a) {
                fs = FS.PasswordSettings;
                if (password) {
                    if (password.length < fs.minLength || password.length > fs.maxLength)
                        return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.password.length))];
                    else
                        return [2 /*return*/, Promise.resolve(Result_1.default.Success(Response_1.RESPONSE.password.valid))];
                }
                return [2 /*return*/, Promise.reject(Result_1.default.Failure(ErrorResponse_1.ERROR_RESPONSE.INVALID_REQUEST))];
            });
        });
    };
    return User;
}());
exports.default = User;
