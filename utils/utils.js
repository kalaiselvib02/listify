const MESSAGE_CONSTANTS = require("../constants/messages");
const fsPromises = require("fs").promises;
const path = require("path");
const jwt = require("jsonwebtoken");

const helpers = {
    checkEmptyArr : (arr) => {
        return arr.length == 0;
    },
    setResponse : (key , statusVal , res) => {
        res.json({
            status: MESSAGE_CONSTANTS[key][statusVal].STATUS,
            message: MESSAGE_CONSTANTS[key][statusVal].MESSAGE
          });
    },
    setResponseAuth: (key , statusVal , res) => {
        res.json({
            status: key[statusVal].STATUS,
            message: key[statusVal].MESSAGE
          });
    },
    checkValidBodyRequest : (key , res) => {
        res.json({
            status: MESSAGE_CONSTANTS[key].REQUIRED.STATUS,
            message: MESSAGE_CONSTANTS[key].REQUIRED.MESSAGE
          });
    },
    writeToLocalFile :  (dir , fileName , dataArr) => {
         fsPromises.writeFile(
            path.join(__dirname, "..", dir, fileName),
            JSON.stringify(dataArr)
          );
    },
    setJWTtoken : (payLoad , token , expirationVal) => {
        return jwt.sign(
            payLoad,
            token,
            { expiresIn: expirationVal }
        )
    }
    
}


module.exports = helpers;