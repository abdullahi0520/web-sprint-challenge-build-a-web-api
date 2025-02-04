// add middlewares here related to projects
const Projects = require('./projects-model');

async function validateProjectId (req,res, next) {
    try {
        const {id} = req.params.id
        const project = await Projects.get(id)
        if (project) {
            req.project = project
            next()
        } else {
            res.status(404).json({message: 'doesnt exist'})
        }
    } catch (err) {
        next(err);
    }
}

async function validateProject (req, res, next){
    const {name, description, completed} = req.body
    if(!name || !name.trim()){
        res.status(400).json({message: 'missing required name field'})
    }else if(!description || !description.trim()){
        res.status(400).json({message: 'missing required description field'})
    }else{
        req.name = name.trim()
        req.description = description.trim()
        req.completed = completed
        next();
    }
}

module.exports = {validateProjectId, validateProject}