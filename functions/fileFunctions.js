
var fs = require('fs')
import { RESPONSES } from "./helperConstants";

/**
 * Converts the base64 string to image
 * and saves it to "users/u_id/profile/filename.ext"
 *
 *@param {string} u_id - user id
 *@param {string} filename - randomly generated filename
 *@param {string} imageData - base64 image
 *@returns {string} photo url.
 * 
 * 
 *
 *@example
 *  saveImage("user123", "myfile", "data:image/jpeg;randomstr")
 *@outputs http://localhost:4040/media/user123/profile/myfile.jpg
 * saves to /users/user123/profile/myfile.jpg
 */

function decodeBase64Image(dataString){
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

    if(matches.length !== 3){
        return RESPONSES.IMAGE_UPLOAD_ERROR
    }

    response.type = matches[0]
    response.data = new Buffer(matches[2], 'base64')
    return response
}

export async function saveImage(u_id, filename, imageData){

    var ext = data.substring(11, data.indexOf(";base64"))
    var imageBuffer = decodeBase64Image(imageData)
    if(imageBuffer.hasOwnProperty("errorStatus")){
        return RESPONSES.IMAGE_UPLOAD_ERROR
    }
    let imageFile = "/users/"+u_id+"/profile/"+filename+"."+ext
    console.log(imageFile)
    fs.writeFile(imageFile, imageBuffer.data, (err) =>{
        console.log(err)
          return RESPONSES.IMAGE_UPLOAD_ERROR 
    })
    let imageURI = BASE_DEV + u_id+"/profile/" + imageFile 
    return {
        errorStatus: false,
        imageURI: imageURI
    }

}