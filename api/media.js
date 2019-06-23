var express = require("express")
var media = express.Router()
var fs = require('fs')
var jwt = require('jsonwebtoken')
var crypto = require('crypto')
var sha256 = require('js-sha256')
var privateKey = fs.readFileSync('./security/private.key', 'utf8')
var publicKey = fs.readFileSync('./security/public.key', 'utf8')
var path = require('path')



media.get("/:u_id/profile/:filename", async (req, res) =>{
    let {
        u_id,
        filename
    } = req.params

    // return res.json({u_id, filename, x: __dirname + u_id + "/"})
  
     return res.sendFile(filename, {  root:path.join(__dirname , '../private/user/' + u_id + '/profile')})
})


media.get("/defaultUser/profile/:filename", async (req, res) =>{
    return res.sendFile(filename, {root: path.join(__dirname, '../public/defaultUser/profile')})
})




module.exports = media