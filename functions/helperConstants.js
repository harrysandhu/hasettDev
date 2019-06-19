

export const RESPONSES = {
    ERR_SYSTEM: {
        errorStatus : true, 
        errorCode: "ERROR/ERR_SYSTEM",
        errorMessage: 'Something went wrong!🤕'
    },
    EMAIL_LENGTH: {
        errorStatus: true, 
        errorCode: 'ERROR/EMAIL_LENGTH',
        errorMessage: 'Please enter a valid email address.'
    },
    EMAIL_FORMAT: {
        errorStatus: true, 
        errorCode: 'ERROR/EMAIL_FORMAT',
        errorMessage: 'Please enter a valid email address.'
    },
    SUCCESS: {
        errorStatus: false,
        errorCode: null,
        errorMessage: null
    },
    ERR_CONNECTION: {
        errorStatus: true,
        errorCode: "ERROR/ERR_CONNECTION",
        errorMessage: "Can't connect to the server."
    },
    PASSWORD_LENGTH: {
        errorStatus: true,
        errorCode: "ERROR/PASSWORD_LENGTH",
        errorMessage: "Password must be minimum 8 characters long."
    },
    ERR_DB_CONNECTION : {
        errorStatus: true, 
        errorCode: "ERROR/DB",
        errorMessage: "Something went wrong!"
    },
    'EMAIL_AVAILABLE':{
        errorStatus: false,
        errorCode: null,
        errorMessage: null,
        emailStatus: true
    },
      EMAIL_UNAVAILABLE: {
        errorStatus: true, 
        errorCode: 'ERROR/EMAIL_UNAVAILABLE',
        errorMessage: 'A user with this email already exists.',
        emailStatus: false
    },
  
    'INVALID_REQUEST': {
        errorStatus: true, 
        errorCode: "ERROR/INVALID_REQUEST",
        errorMessage: "Invalid request."
    },
    'PASSWORD_VALID':{
        errorStatus: false,
         errorCode: null,
        errorMessage: null,
        passwordStatus: true
    },
    'USERNAME_AVAILABLE': {
        errorStatus: false,
        errorCode: null,
        errorMessage: null,
        usernameStatus: true
    },
    'USERNAME_UNAVAILABLE' : {
        errorStatus: true,
        errorCode: 'ERROR/USERNAME_UNAVAILABLE',
        errorMessage: 'Username is taken.',
        usernameStatus: false
    },

    'USER_UNAUTHORIZED': {
        errorStatus: true,
        errorCode: 'ERROR/USER_UNAUTHORIZED',
        errorMessage: 'Unauthorized.'
    },
    'USERNAME_LENGTH' : {
        errorStatus: true,
        errorCode: 'ERROR/USERNAME_LENGTH',
        errorMessage: 'Username must be minimum 2 characters long.'
    },
    'USERNAME_FORMAT' : {
        errorStatus: true,
        errorCode: 'ERROR/USERNAME_FORMAT',
        errorMessage : 'Username can only contain . - _ as special characters.'
    },
    'IMAGE_UPLOAD_ERROR': {
        errorStatus: true,
        errorCode: 'ERROR/IMAGE_UPLOAD_ERROR',
        errorMessage: 'Couldn\'t complete that operation. Please try again.'
    }

    

    
}