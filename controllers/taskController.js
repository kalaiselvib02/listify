

const taskService = require("../services/taskService");

const tasksDB = {
  tasks: require("../api/task-api.json"),
  setTasks: function (tasksDB) {
    this.tasks = tasksDB;
  },
};

const getAllTasksList = async (req, res) => {
await taskService.getList(req , res , tasksDB)
};

const createNewTask =  async (req, res) => {
   await taskService.create(req , res)
};

const updateTask = async  (req, res) => {
   await taskService.update(req , res)
};

const deleteTask = async (req, res) => {
 await taskService.delete(req , res)
};

const getTask = async (req, res) => {
 await taskService.getTask(req , res)
};

module.exports = {
  getAllTasksList,
  createNewTask,
  getTask : getTask,
  update : updateTask,
  delete : deleteTask,
};
