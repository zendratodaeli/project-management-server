const router = require("express").Router();
const mongoose = require("mongoose");

const Task = require("../models/Task.model");
const Project = require("../models/Project.model");

//  POST /api/tasks  -  Creates a new task
router.post("/tasks", (req, res, next) => {
    const { title, description, projectId } = req.body;

    const newTaskDetails = { 
      title: title, 
      description: description, 
      project: projectId
  };

    Task.create(newTaskDetails)
        .then(newTask => {
            return Project.findByIdAndUpdate(projectId, { $push: { tasks: newTask._id } });
        })
        .then(response => res.status(201).json(response))
        .catch(err => {
            console.log("error creating a new task", err);
            res.status(500).json({
                message: "error creating a new task",
                error: err
            });
        })

});

// GET /api/tasks -  Retrieves all of the projects
router.get('/tasks', (req, res, next) => {
  Task.find()
      .then(response => {
          res.json(response)
      })
      .catch(err => {
          console.log("error getting list of projects", err);
          res.status(500).json({
              message: "error getting list of projects",
              error: err
          });
      })
});


//  GET /api/tasks/:projectId  -  Get details of a specific project by id
router.get('/tasks/:projectId', (req, res, next) => {
    
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
  }

  Task.findById(projectId)
      .then(project => res.json(project))
      .catch(err => {
          console.log("error getting details of a project", err);
          res.status(500).json({
              message: "error getting details of a project",
              error: err
          });
      })
});


// PUT /api/tasks/:projectId  -  Updates a specific project by id
router.put('/tasks/:projectId', (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
  }

  const newDetails = {
      title: req.body.title,
      description: req.body.description,
      tasks: req.body.tasks
  }

  Task.findByIdAndUpdate(projectId, newDetails, { new: true })
      .then((updatedProject) => res.json(updatedProject))
      .catch(err => {
          console.log("error updating project", err);
          res.status(500).json({
              message: "error updating project",
              error: err
          });
      })
});

// DELETE /api/tasks/:projectId  -  Delete a specific project by id
router.delete('/tasks/:projectId', (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
  }

  Task.findByIdAndRemove(projectId)
      .then(() => res.json({ message: `Project with id ${projectId} & all associated tasks were removed successfully.` }))
      .catch(err => {
          console.log("error deleting project", err);
          res.status(500).json({
              message: "error deleting project",
              error: err
          });
      })
});

module.exports = router;
