import sanitizeBody from '../middleware/sanitizeBody.js'
import Person from '../models/Person.js'
import User from '../models/User.js'
import logger from '../startup/logger.js'
import authUser from '../middleware/authUser.js'
import ResourceNotFoundException from '../middleware/exceptions/ResourceNotFound.js'
import handleErrors from '../middleware/handleErrors.js'
import express from 'express'

const log = logger.child({ module: 'peopleRoute' })

const router = express.Router()

router.get('/', authUser, async (req, res) => {
  const user = await User.findById(req.user._id)
  const collection = await Person.find({owner: user}).populate('gifts')
  res.send({ data: collection })
})

router.post('/', authUser, sanitizeBody, async (req, res) => {
  let newDocument = new Person(req.sanitizedBody)
  try {
    const user = await User.findById(req.user._id)
    newDocument.owner = user;
    await newDocument.save()
    res.status(201).send({ data: newDocument })
  } catch (err) {
    log.error(err)
    handleErrors(err)
  }
})

router.get('/:id', authUser, async (req, res) => {
  try {
    const document = await Person.findById(req.params.id).populate('gifts')
    if (!document) throw new ResourceNotFoundException('Resource not found')

    res.send({ data: document })
  } catch (err) {
    sendResourceNotFound(req, res)
  }
})

const update = (overwrite = false) => async (req, res) => {
  try {
    const document = await Person.findByIdAndUpdate(
      req.params.id,
      req.sanitizedBody,
      {
        new: true,
        overwrite,
        runValidators: true,
      }
    )
    if (!document) throw new ResourceNotFoundException('Resource not found')
    res.send({ data: document })
  } catch (err) {
    handleErrors(req, res)
  }
}
router.put('/:id', authUser, sanitizeBody, update(true))
router.patch('/:id', authUser, sanitizeBody, update(false))

router.delete('/:id', authUser, async (req, res) => {
  try {
    const document = await Person.findByIdAndRemove(req.params.id)
    if (!document) throw new ResourceNotFoundException('Resource not found')
    res.send({ data: document })
  } catch (err) {
    handleErrors(req, res)
  }
})

export default router
