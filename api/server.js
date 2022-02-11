const express = require('express');
const server = express();
const actionsRouter = require('./actions/actions-router')
const projectsRouter = require('./projects/projects-router')
server.use(express.json())
  server.use('/api/actions', actionsRouter)
  server.use('/api/projects', projectsRouter)


  server.use((error,req,res,next) => {
    res.status(error.status || 500).json({
      message: "An error has happened bro",
      err: error.message
    });
    next();
  });


// Configure your server here
// Build your actions router in /api/actions/actions-router.js
// Build your projects router in /api/projects/projects-router.js
// Do NOT `server.listen()` inside this file!

module.exports = server;
