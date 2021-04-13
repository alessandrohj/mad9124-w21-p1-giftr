import User from '../../models/User.js'
import sanitizeBody from '../../middleware/sanitizeBody.js'
import authUser from '../../middleware/authUser.js'
import express from 'express'
const router = express.Router()

router.post('/users', sanitizeBody, async (req, res) => {
    new User(req.sanitizedBody)
    .save()
    .then((newUser) => res.status(201).send({data: newUser}))
    .catch(next)
})

router.get('/users/me', authUser, async (req, res) => {
  req.user._id
  const user = await User.findById(req.user._id)
  res.send({ data: user })
})

// Login a user and return an authentication token.
router.post('/tokens', sanitizeBody, async (req, res) => {
  const { email, password } = req.sanitizedBody
  const authenticatedUser = await User.authenticate(email, password)

  if (!authenticatedUser) {
    return res.status(401).send({
      errors: [
        {
          status: '401',
          title: 'Incorrect username or password',
        },
      ],
    })
  }

  res
    .status(201)
    .send({ data: { token: authenticatedUser.generateAuthToken() } })
})

// Allow user to change password.
router.patch('/users/me', authUser, sanitizeBody, async (req, res)=>{
  const { email, password } = req.sanitizedBody
  let user = await User.findOne({_id: req.user._id}, function(err, doc){
    if(err) res.send(err);
    doc.password = password
    doc.save();
  })
  res.status(201).send({data: user});
  })

//Reset password

export default router
