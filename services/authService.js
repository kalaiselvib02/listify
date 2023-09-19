

const APP_CONSTANTS = require("../constants/constants");
const MESSAGE_CONSTANTS = require("../constants/messages");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { setResponseAuth } = require("../utils/utils");
const helpers = require("../utils/utils");
const logger = require("../loggers/loggers");


const usersDB = {
  users: require("../api/user-api.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const userLogin = async (req, res) => {
 
  const { username, password } = req.body;

  // Check Empty Values
  if (!username || !password) return setResponseAuth(MESSAGE_CONSTANTS.AUTH.LOGIN , APP_CONSTANTS.REQUIRED , res)
 
  const foundUser = usersDB.users.find(person => person.username === username);

  logger.info("User Found from local DB")

  //Unauthorized User
  if (!foundUser) {
    logger.info("User not found from local DB")
    return setResponseAuth(MESSAGE_CONSTANTS.AUTH.LOGIN , APP_CONSTANTS.ERROR , res)
  }
  
   
  // verify password 
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {

  // create JWTs

  const accessToken = helpers.setJWTtoken({ username: foundUser.username }, process.env.ACCESS_TOKEN_SECRET ,APP_CONSTANTS.ACCESS_TOKEN_DURATION )

  const refreshToken = helpers.setJWTtoken({ username: foundUser.username }, process.env.ACCESS_TOKEN_REFRESH , APP_CONSTANTS.REFRESH_TOKEN_DURATION)

  // Saving refreshToken with current user

  const otherUsers = usersDB.users.filter(person => person.username != foundUser.username);

  const currentUser = { ...foundUser, refreshToken };

  usersDB.setUsers([...otherUsers, currentUser]);

  helpers.writeToLocalFile("api", "user-api.json" , usersDB.users)

    res.cookie(APP_CONSTANTS.JWT, refreshToken, {
      httpOnly: true,
      sameSite: APP_CONSTANTS.NONE,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    logger.info("User Logged in successfully")
    res.json({ accessToken });
    logger.info("Sending access token")
  } 
  else {
        helpers.setResponseAuth(MESSAGE_CONSTANTS.AUTH.LOGIN , APP_CONSTANTS.FAIL , res)
    }
}

const userSignup = async (req, res) => {
  const { username, password } = req.body;

  // Check Empty Values
  if (!username || !password) return setResponseAuth(MESSAGE_CONSTANTS.AUTH.SIGNUP , APP_CONSTANTS.REQUIRED , res)
  
  // check for duplicate usernames in the db
  const duplicate = usersDB.users.find(
    (person) => person.username === username
  );

  //Conflict
  if (duplicate) return setResponseAuth(MESSAGE_CONSTANTS.AUTH.SIGNUP , APP_CONSTANTS.CONFLICT , res)
    

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);
    //store the new user
    const newUser = { username: username, password: hashedPwd };

    logger.info("New user not added to local db")
    usersDB.setUsers([...usersDB.users, newUser]);
    await helpers.writeToLocalFile("api", "user-api.json" , usersDB.users);

    logger.info("Send response to client")
    helpers.setResponseAuth(MESSAGE_CONSTANTS.AUTH.SIGNUP , APP_CONSTANTS.SUCCESS , res);

    } catch (err) {
    res.status(500).json({ message: err.message });
    }
};

const handleRefreshToken = (req, res) => {

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(person => person.refreshToken == refreshToken);
  
  if (!foundUser) return res.sendStatus(403);

   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {

    if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

    const accessToken = helpers.setJWTtoken({ username: decoded.username }, process.env.ACCESS_TOKEN_SECRET ,APP_CONSTANTS.REFRESH_TOKEN_DURATION )
   
    res.json({ accessToken });
  });

};

module.exports = {
  login: userLogin,
  signup: userSignup,
  refresh: handleRefreshToken,
};
