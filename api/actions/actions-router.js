// Write your "actions" router here!

const Actions = require("./actions-model")
const express = require("express")
const router = express.Router()
router.use(express.json())
const {validateActionId, validateAction} = require("./actions-middlware")

router.get('/', (req,res,next) => {
    console.log('recieved get request')
    Actions.get(req.action)
    .then(actions => {
        if(!actions) {
            res.status(200).json([])
        } else {
            res.status(200).json(actions)
        }
    }).catch(() => {
        res.status(500).json({
            message: "error"
        })
        next();
    })
})

router.get('/:id', validateActionId, (req,res,next) => {
    Actions.get(req.params.id)
    .then(actions => {
        if (!actions) {
            res.status(404).json({message: 'invalid ID'})
        } else {
            res.status(200).json(actions)
        }
    })
    .catch(()=> {
        next();
    })
})

router.post('/', validateAction, (req,res,next)=> {
    Actions.insert(req.body)
    .then(actions => {
        res.status(201).json(actions)
    })
    .catch(next)
})

router.put('/:id', validateAction, validateActionId, (req,res,next) => {
    const {project_id, notes, description, completed} = req.body
    if(!project_id ||!notes || !description || !completed){
        res.status(400).json({message: 'update'})
    }else{
        Actions.update(req.params.id, req.body)
        .then(() => {
            return Actions.get(req.params.id)
        })
        .then(actions => {
            res.json(actions)
        })
        .catch(next)
    }
})

router.delete("/:id", validateActionId, async (req, res, next) => {
    try{
        await Actions.remove(req.params.id)
        res.json(res.Actions)
    } catch(err){
        next(err)
    }
})

module.exports = router;