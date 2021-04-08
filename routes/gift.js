import sanitizeBody from '../middleware/sanitizeBody.js'
// import Gift from '../models/Gift.js'
import logger from '../startup/logger.js'
import authUser from '../middleware/authUser.js'
import handleErrors from '../middleware/handleErrors.js'
import ResourceNotFoundException from '../middleware/exceptions/ResourceNotFound.js'
import express from 'express'

const log = logger.child({module: 'giftRoute'});

const router = express.Router()

router.post('/people/:id/gifts/:giftId', sanitizeBody, async (req, res) => {

})

  router.patch('/people/:id/gifts/:giftId', sanitizeBody, async (req, res)=>{
//pending to be created

  })


router.delete('/people/:id/gifts/:giftId', async (req, res) => {

})

export default router
