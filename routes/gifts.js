import sanitizeBody from '../middleware/sanitizeBody.js'
import Gift from '../models/Gift.js'
import logger from '../startup/logger.js'
import authUser from '../middleware/authUser.js'
import handleErrors from '../middleware/handleErrors.js'
import ResourceNotFoundException from '../middleware/exceptions/ResourceNotFound.js'
import express from 'express'

const log = logger.child({ module: 'giftRoute' })

const router = express.Router()

router.post('/:id/gifts', authUser, sanitizeBody, async (req, res) => {
  let newDocument = new Gift(req.sanitizedBody)
  try {
    await newDocument.save()
    res.status(201).send({ data: newDocument })
  } catch (err) {
    log(err)
    handleErrors(err)
  }
})

router.patch(
  '/people/:id/gifts/:giftId',
  authUser,
  sanitizeBody,
  async (req, res) => {
    //pending to be created
  }
)

router.delete('/people/:id/gifts/:giftId', authUser, async (req, res) => {})

export default router
