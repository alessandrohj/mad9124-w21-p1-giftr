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

const update = (overwrite = false) => async (req, res) => {
  try {
    const document = await Gift.findByIdAndUpdate(
      req.params.giftId,
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

router.patch('/:id/gifts/:giftId', authUser, sanitizeBody, update(false))

router.delete('/:id/gifts/:giftId', authUser, async (req, res) => {
  try {
    const document = await Gift.findByIdAndRemove(req.params.giftId)
    if (!document) throw new ResourceNotFoundException('Resource not found')
    res.send({ data: document })
  } catch (err) {
    handleErrors(req, res)
  }
})

export default router
