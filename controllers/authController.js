const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const MESSAGE_CONSTANTS = require("../constants/messages");
const APP_CONSTANTS = require("../constants/constants");
const authService = require("../services/authService");

const usersDB = {
  users: require("../api/user-api.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const userLogin = async (req, res) => {
 await authService.login(req , res)
}

const userSignup = async (req, res) => {
  const { username, password } = req.body;

   // check for empty values
  if (!username || !password)
   return res.status(400).json({ status: MESSAGE_CONSTANTS.AUTH.SIGNUP.REQUIRED.STATUS,
    message: MESSAGE_CONSTANTS.AUTH.SIGNUP.REQUIRED.MESSAGE,})
  
  
  // check for duplicate usernames in the db
  const duplicate = usersDB.users.find(
    (person) => person.username === username
  );

  if (duplicate)
    return res.status(MESSAGE_CONSTANTS.AUTH.SIGNUP.CONFLICT.STATUS).json({
      status: MESSAGE_CONSTANTS.AUTH.SIGNUP.CONFLICT.STATUS,
      message: MESSAGE_CONSTANTS.AUTH.SIGNUP.CONFLICT.MESSAGE,
    }); //Conflict

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);
    //store the new user
    const newUser = { username: username, password: hashedPwd };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "api", "user-api.json"),
      JSON.stringify(usersDB.users)
    );
    res.status(MESSAGE_CONSTANTS.AUTH.SIGNUP.SUCCESS.STATUS).json({
      status: MESSAGE_CONSTANTS.AUTH.SIGNUP.SUCCESS.STATUS,
      message: MESSAGE_CONSTANTS.AUTH.SIGNUP.SUCCESS.MESSAGE,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(
    (person) => person.refreshToken == refreshToken
  );
  if (!foundUser) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: APP_CONSTANTS.REFRESH_TOKEN_DURATION }
    );
    res.json({ accessToken });
  });
};

module.exports = {
  login: userLogin,
  signup: userSignup,
  refresh: handleRefreshToken,
};
