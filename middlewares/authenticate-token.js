require('dotenv').config();
const jwt = require('jsonwebtoken');
const logger = require('../loggers/loggers');
const helpers = require('../utils/utils');
const APP_CONSTANTS = require("../constants/constants")
const MESSAGE_CONSTANTS = require("../constants/messages")


const authenticateToken = async (req, res , next ) => {
   logger.info("Token Verfication")
    const authHeader = req.headers['authorization'];

    if (!authHeader){
        // Empty Token Value
        logger.info("User - No Token")
        return helpers.setResponseAuth(MESSAGE_CONSTANTS.TOKEN_VERFICATION , APP_CONSTANTS.UNAUTHORIZED , res)
    }
  
    const token = authHeader.split(' ')[1];
  
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                //invalid token
                logger.info("User - Invalid Token")
                return helpers.setResponseAuth(MESSAGE_CONSTANTS.TOKEN_VERFICATION , APP_CONSTANTS.FORBIDDEN , res)
            }
            req.user = decoded.username;
            logger.info("Token Verified and User Authenticated")
            next();
        }
    );
}


module.exports = authenticateToken;



