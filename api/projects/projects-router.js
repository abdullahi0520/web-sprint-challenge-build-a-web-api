// Write your "projects" router here!
const express = require('express')
const Projects = require('./projects-model')
const router = express.Router()
const {validateProjectId, validateProject} = require('./projects-middleware')
router.use(express.json())

router.get('/', (req,res,next) => {
    console.log('recieved get request')
    Projects.get(req.projects)
    .then(projects => {
        if(!projects) {
            res.status(200).json([])
        } else {
            res.status(200).json(projects)
        }
    }).catch(() => {
        res.status(500).json({
            message: "error"
        })
        next();
    })
})

router.get('/:id', validateProjectId, (req,res,next) => {
    Projects.get(req.params.id)
    .then(projects => {
        if (!projects) {
            res.status(404).json({message: 'invalid ID'})
        } else {
            res.status(200).json(projects)
        }
    })
    .catch(()=> {
        next();
    })
})

router.post('/', validateProject, (req,res,next)=> {
    Projects.insert(req.body)
    .then(projects => {
        res.status(201).json(projects)
    })
    .catch(next)
})

router.put('/:id', validateProjectId, validateProject, (req,res,next) => {
    const {name, description, completed} = req.body
    if(!name || !description || !completed){
        res.status(400).json({message: 'update'})
    }else{
        Projects.update(req.params.id, req.body)
        .then(() => {
            return Projects.get(req.params.id)
        })
        .then(project => {
            res.json(project)
        })
        .catch(next)
    }
})

router.delete('/:id', validateProjectId, async(req, res,next) => {
    try {
      const result = await Projects.remove(req.params.id)
      res.json(result)
    } catch (err) {
      next(err)
    }
  });

  router.get('/:id/actions', (req, res) => {
    Projects.get(req.params.id)
    .then((actions) => {
        if(!actions){
            res.status(404).json({message: 'The project with this id does not exist'})
        }else{
            Projects.getProjectActions(req.params.id).then((actions) => {
                res.status(200).json(actions)
            })
        }
    })
    .catch(() => {
        res.status(500).json({message: 'error'})
    })
})

module.exports = router;