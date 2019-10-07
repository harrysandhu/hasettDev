var express = require("express")
var path = require("path")
var app = express()

var server = require("http").Server(app)
var io = require('socket.io')(server)
var api = require('./api/api')
//v2 api
var main = require('./api/v2/main')
var auth = require("./api/auth")
var media = require("./api/media")
var bodyParser = require("body-parser")
var morganLogger = require("morgan")
var cors = require('cors')

const PORT = 4040
app.use(cors())

app.use(morganLogger('dev'))

app.use(express.static('private'))
app.use(bodyParser.json({limit: '5mb'}))
app.use(bodyParser.urlencoded({ limit: '5mb', extended: false }))
app.set('json spaces', 2);

server.listen(PORT, () =>{
    console.log("listening on port :" , PORT)
})


app.use("/api", api)
app.use("/api/auth", auth)
app.use("/media", media)
app.use("/api/v2", main)