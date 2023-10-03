
const APP_CONSTANTS = require("../constants/constants");
const helpers = require("../utils/utils");
const logger = require("../loggers/loggers");
const { v4: uuidv4 } = require('uuid');


const tasksDB = {
  tasks: require("../api/task-api.json"),
  setTasks: function (tasksDB) {
    this.tasks = tasksDB;
  },
};


const getList = (req , res , dataArr) => {
  const isEmptyArr = helpers.checkEmptyArr(dataArr);

  if(isEmptyArr){
    logger.info("Empty Tasks List Arr")
    helpers.setEmptyResponse(APP_CONSTANTS.TASK , APP_CONSTANTS.EMPTY , res)
  }    
  else {
    logger.info("Displaying Tasks List")
    displayTasksList(req , res , dataArr)
  }
}

const displayTasksList = (req , res , dataArr) => {


            
    const { title, priority, dueDate, page, limit , sortVal } = req.query;




    if(sortVal) {
     sortTasksList(req , res , dataArr)
    }
    else if (title || priority || dueDate) {
       filterTaskList(req , res , dataArr)
    } 
    else if (page && limit) {
      const paginatedResults = res.paginatedResults
      paginateTasksList(paginatedResults , res)
    }
    else {
      res.send(dataArr);
    }
}

const sortTasksList = (dataArr) => {
    dataArr.sort(function(a, b){
        if(orderBy = "desc") { 
          return -1; 
        }
        if(orderBy = "asce") { 
          return 1; 
        }
        return 0;
    })
}

const paginateTasksList = (arr , res) => {
  logger.info("Displaying Pagination Results")
  res.send(arr)
}

const filterTaskList = (req , res , dataArr) => {
    logger.info("Filtering Tasks List")
    const filters = req.query;
    const filteredTasks = dataArr.tasks.filter((task) => {
      let isValid = true;
      for (key in filters) {
        isValid = isValid && task[key] == filters[key];
      }
      return isValid;
    });
    res.send(filteredTasks);
}

const createTask = async (req , res) => {
  logger.info("Creating New Task");

  try {
    const newTask = {
      id: uuidv4(),
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      dueDate: new Date(),
      taskComments: req.body.taskComments,
    };
  
  if (!newTask.title || !newTask.description) {
    logger.info("Passed : Invalid Body Inputs")
    await checkValidBodyRequest(APP_CONSTANTS.TASK , res);
    logger.info("Passed : Set Invalid Response ")
  }

 
  tasksDB.setTasks([...tasksDB.tasks, newTask]);
  await helpers.writeToLocalFile("api", "task-api.json" , tasksDB.tasks)

  logger.info("Passed : Written New task to local file")

  helpers.setResponse(APP_CONSTANTS.TASK , APP_CONSTANTS.CREATE, res);
  logger.info("Passed : Success Response for new task")

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const updateTask = async (req , res) => {
  logger.info("Passed : Updating Tasks")

  const task = tasksDB.tasks.find((task) => task.id == req.params.id);

  if (!task) {
    helpers.setResponse(APP_CONSTANTS.TASK , APP_CONSTANTS.NOT_FOUND , res);
  }

  if (req.body) {
    task.title = req.body.title;
    (task.description = req.body.description),
      (task.priority = req.body.priority),
      (task.dueDate = req.body.dueDate),
      (task.taskComments = req.body.taskComments);
  }

  const filteredArray = tasksDB.tasks.filter(task => task.id != req.body.id);

  tasksDB.setTasks(filteredArray);

  await helpers.writeToLocalFile("api", "task-api.json" , tasksDB.tasks)
  logger.info("Passed : Updated New task to local file")

  helpers.setResponse(APP_CONSTANTS.TASK , APP_CONSTANTS.UPDATE,  res);
  logger.info("Passed : Updated Response for existing task");
 
}

const deleteTask = async (req , res) => {

  logger.info("Passed : Deleting Tasks")
  const filteredArray = tasksDB.tasks.filter(task => task.id != req.params.id);

  tasksDB.setTasks(filteredArray);
  await helpers.writeToLocalFile("api", "task-api.json" , tasksDB.tasks);

  helpers.setResponse(APP_CONSTANTS.TASK , APP_CONSTANTS.DELETE , res);
  logger.info("Passed : Updated Response for existing task");

}

const getTask = async (req , res) => {
  logger.info("Passed : Get Single Task")
  const task = tasksDB.tasks.find(task => task.id === req.params.id);

  if (!task) {
    helpers.setResponse(APP_CONSTANTS.TASK , APP_CONSTANTS.NOT_FOUND , res);
  }
  res.json(task);
}

module.exports = {
  getList,
  getTask , getTask,
  create : createTask,
  update : updateTask,
  delete : deleteTask
}