

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
    EMAIL_EXISTS: {
        errorStatus: true, 
        errorCode: 'ERROR/EMAIL_EXISTS',
        errorMessage: 'A user with this email already exists.'
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
        emailStatus: true
    },
    'EMAIL_UNAVAILABLE':{
        errorStatus: false,
        emailStatus: false
    },
    'INVALID_REQUEST': {
        errorStatus: true, 
        errorCode: "ERROR/INVALID_REQUEST",
        errorMessage: "Invalid request."
    },
    'PASSWORD_VALID':{
        errorStatus: false,
        passwordStatus: true
    }
    
}