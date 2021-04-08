import sanitizeBody from '../middleware/sanitizeBody.js'
import Person from '../models/Person.js'
import logger from '../startup/logger.js'
import authUser from '../middleware/authUser.js'
import sendResourceNotFound from '../middleware/exceptions/ResourceNotFound.js'
import express from 'express'

const log = logger.child({module: 'peopleRoute'});

const router = express.Router()

router.get('/', authUser, async (req, res) => {
  const collection = await Person.find()
  res.send({ data: collection })
})

router.post('/', authUser, sanitizeBody, async (req, res) => {
  let newDocument = new Person(req.sanitizedBody)
  try {
    await newDocument.save()
    res.status(201).send({ data: newDocument })
  } catch (err) {
    log(err)
    res.status(500).send({
      errors: [
        {
          status: '500',
          title: 'Server error',
          description: 'Problem saving document to the database.',
        },
      ],
    })
  }
})

router.get('/:id', authUser, async (req, res) => {
  try {
    const document = await Person.findById(req.params.id)
    if (!document) throw new Error('Resource not found')

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
    if (!document) throw new Error('Resource not found')
    res.send({ data: document })
  } catch (err) {
    sendResourceNotFound(req, res)
  }
}
router.put('/:id', authUser, sanitizeBody, update(true))
router.patch('/:id', authUser, sanitizeBody, update(false))

router.delete('/:id', authUser, async (req, res) => {
  try {
    const document = await Person.findByIdAndRemove(req.params.id)
    if (!document) throw new Error('Resource not found')
    res.send({ data: document })
  } catch (err) {
    sendResourceNotFound(req, res)
  }
})

export default router
