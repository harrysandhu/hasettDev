"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path = require("path");
var xapp = express_1.default();
var server = require("http").Server(xapp);
var io = require('socket.io')(server);
var main = require('./fire/main');
var PORT = 4040;
xapp.get("/", function (req, res) {
    res.send("hello,world");
});
xapp.listen(PORT, function () {
    console.log("listening on port: ", PORT);
});
xapp.use("/main", main);
