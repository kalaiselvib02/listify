 const ERROR_CONSTANTS = {
    AUTH : {
        LOGIN : {
            SUCCESS : {
                APP_CONSTANTS : "User Logged In Successfully",
                STATUS : 201
            },
            FAIL : {
                MESSAGE : "User Authentication Failed",
                STATUS : 401
            },
            ERROR : {
                MESSAGE : "Cannot Find User",
                STATUS : 403
            },
            REQUIRED : {
                MESSAGE : "Username and Password Required",
                STATUS : 400
            },
        },
        SIGNUP :  {
            SUCCESS : {
                MESSAGE : "User Registered Successfully",
                STATUS : 201
            },
            FAIL : {
                MESSAGE : "User Registered Failed",
                STATUS : 401
            },
            REQUIRED : {
                MESSAGE : "Username and Password Required",
                STATUS : 400
            },
            CONFLICT : {
                MESSAGE : "Username Already Exists",
                STATUS : 403
            }
        },
    },
    TOKEN_VERFICATION: {
        FORBIDDEN : {
                MESSAGE : "User Forbidden to Access - Please Enter a Valid Token",
                STATUS : 403
        },
        UNAUTHORIZED: {
            MESSAGE : "User Unauthorized to Access - Please Enter a Token",
            STATUS : 401
        }
    },
    TASK : {
        EMPTY : {
            MESSAGE : "No Tasks to Display",
            STATUS : 204
        },
        REQUIRED : {
            MESSAGE : "Title and Description Required",
            STATUS : 400
        },
        NOT_FOUND : {
            MESSAGE : "Task Not Found",
            STATUS : 400
        },
        CREATE : {
            MESSAGE : "Task Successfully Created",
            STATUS : 201
        },
        UPDATE : {
            MESSAGE : "Task Successfully Updated",
            STATUS : 201
        },
        DELETE : {
            MESSAGE : "Task Successfully Deleted",
            STATUS : 201
        }
    }
}

module.exports = ERROR_CONSTANTS