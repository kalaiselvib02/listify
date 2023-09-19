const express = require("express");

const app = express();

let taskRouter = express.Router();

const taskController = require("../controllers/taskController");
const authenticateToken = require("../middlewares/authenticate-token");
const paginationMiddleware = require("../middlewares/pagination");

taskRouter
  .route("/tasks")
  .get(authenticateToken ,paginationMiddleware , taskController.getAllTasksList);

taskRouter.route("/task").post(authenticateToken , taskController.createNewTask);
 
taskRouter.route("/task/:id").get(authenticateToken , taskController.getTask)
taskRouter.route("/task/:id").put(authenticateToken , taskController.update)
taskRouter.route("/task/:id").delete(authenticateToken , taskController.delete)



module.exports = taskRouter;
