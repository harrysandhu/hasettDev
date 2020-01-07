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
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var main = express_1.default.Router();
var fs = require('fs');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var sha256 = require('js-sha256');
var privateKey = fs.readFileSync('./security/private.key', 'utf8');
var publicKey = fs.readFileSync('./security/public.key', 'utf8');
var mysql = require("mysql");
var verifyAuthToken = require('../../functions/helpers').verifyAuthToken;
var genVerificationCode = require('../../functions/helpers').genVerificationCode;
var RESPONSES = require('../../functions/helperConstants').RESPONSES;
var BASE_DEV = require('../../functions/helperConstants').BASE_DEV;
var User_1 = __importDefault(require("../../core/User"));
var Category_1 = __importDefault(require("../../core/Category"));
var ErrorResponse_1 = require("../../core/helper/ErrorResponse");
var aws_sdk_1 = __importDefault(require("aws-sdk"));
require('dotenv').config();
main.get("/", verifyAuthToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_1.default.jwtVerifyUser(req.token, publicKey)];
            case 1:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, res.json(result.get())];
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, res.json(error_1.get())];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
* @method GET
* Gets the related categories to the query category keyword.
* @return CategoryResult ->  Category[]
 */
main.get("/category", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.query.keyword)
                    return [2 /*return*/, res.json(ErrorResponse_1.ERROR_RESPONSE.INVALID_REQUEST)];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Category_1.default.getRelatedCategories(req.query.keyword)];
            case 2:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, res.json(result.get())];
                }
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.log(error_2);
                return [2 /*return*/, res.json(error_2)];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
* @method POST
* Gets the related categories to the query category keyword.
* @return CategoryResult ->  Category[]
 */
main.post("/category", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body.keyword)
                    return [2 /*return*/, res.json(ErrorResponse_1.ERROR_RESPONSE.INVALID_REQUEST)];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Category_1.default.createCategory(req.query.keyword)];
            case 2:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, res.json(result.get())];
                }
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.log(error_3);
                return [2 /*return*/, res.json(error_3)];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @method GET
 * Validates the phone number, generates a 5 digit code and sends an SMS.
 * @return PhoneVerification (type) the code, phone-number, messageId.
*/
main.get("/phonenumbbercode", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validateRes, code_1, params, publishTextPromise, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.query.pn)
                    return [2 /*return*/, res.json(ErrorResponse_1.ERROR_RESPONSE.INVALID_REQUEST)];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, User_1.default.checkPhone(req.query.pn)];
            case 2:
                validateRes = _a.sent();
                if (validateRes) {
                    code_1 = genVerificationCode();
                    params = {
                        Message: "Your verification code: " + code_1,
                        PhoneNumber: "+" + req.query.pn,
                        MessageAttributes: {
                            'AWS.SNS.SMS.SenderID': {
                                'DataType': 'String',
                                'StringValue': "HDVerify1"
                            }
                        }
                    };
                    publishTextPromise = new aws_sdk_1.default.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
                    publishTextPromise.then(function (data) {
                        res.end(JSON.stringify({ MessageID: data.MessageId, code: code_1, phoneNumber: req.query.pn }));
                    });
                }
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.log(error_4);
                return [2 /*return*/, res.json(error_4)];
            case 4: return [2 /*return*/];
        }
    });
}); });
main.get("/sendSMS", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var validateRes, params, publishTextPromise, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.query.pn)
                    return [2 /*return*/, res.json(ErrorResponse_1.ERROR_RESPONSE.INVALID_REQUEST)];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, User_1.default.checkPhone(req.query.pn)];
            case 2:
                validateRes = _a.sent();
                if (validateRes) {
                    params = {
                        Message: req.query.message,
                        PhoneNumber: "+" + req.query.pn,
                        MessageAttributes: {
                            'AWS.SNS.SMS.SenderID': {
                                'DataType': 'String',
                                'StringValue': 'HDVerify1'
                            }
                        }
                    };
                    publishTextPromise = new aws_sdk_1.default.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
                    publishTextPromise.then(function (data) {
                        res.end(JSON.stringify({ MessageID: data.MessageId, message: req.query.message, phoneNumber: req.query.pn }));
                    });
                }
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.log(error_5);
                return [2 /*return*/, res.json(error_5)];
            case 4: return [2 /*return*/];
        }
    });
}); });
module.exports = main;
