const express = require("express");
let authRouter = express.Router();

const authController = require("../controllers/authController");

authRouter.post("/signup" , async (req , res) => authController.signup(req ,res))
authRouter.post("/login" , async (req , res) => authController.login(req,res))
authRouter.get('/refresh', (req , res) => authController.refresh(req,res));

module.exports = authRouter;

