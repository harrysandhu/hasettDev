var express = require("express")
var path = require("path")
var app = express()

var server = require("http").Server(app)
var io = require('socket.io')(server)
var api = require('./api/api')
var bodyParser = require("body-parser")
var morganLogger = require("morgan")
var cors = require('cors')

const PORT = 4040
app.use(cors())

app.use(morganLogger('dev'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.set('json spaces', 2);

server.listen(PORT, () =>{
    console.log("listening on port :" , PORT)
})


app.use("/api", api)
app.use("/api/auth", auth)