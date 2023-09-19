const tasksDB = {
  tasks: require("../api/task-api.json"),
};

const paginationMiddleware = (req , res , next) => {
  
 
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
 
    // calculating the starting and ending index
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
 
    const paginatedResults = {};
   
    paginatedResults.tasks = tasksDB.tasks.slice(startIndex, endIndex);
 
    res.paginatedResults = paginatedResults;
    next();
  
  };

module.exports = paginationMiddleware;