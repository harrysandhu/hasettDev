export function verifyAuthToken(req, res, next){
    //get the auth header value




    const authToken = req.headers['authorization']

    if(typeof authToken !== 'undefined'){
        req.token = authToken
        console.log(req.token)
        //next middleware
        next()
    }else{
        res.json({error: 'Unauthorized.'})
    }
}