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
  await authService.signup(req , res)
};

const handleRefreshToken = async (req, res) => {
 await authService.refresh(req , res)
};

module.exports = {
  login: userLogin,
  signup: userSignup,
  refresh: handleRefreshToken,
};
