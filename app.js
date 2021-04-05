// Don't forget to use NPM to install Express and Mongoose.
import morgan from 'morgan'
import log from './startup/logger.js'
import express from 'express'
import compression from 'compression'
import cors from 'cors'
import sanitizeMongo from 'express-mongo-sanitize'
import connectDatabase from './startup/connectDatabase.js'
connectDatabase()


const app = express()

log.info(process.env.NODE_ENV)
log.warn(app.get('env')) //if NODE_ENV is undefined, returns development

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(sanitizeMongo())

// routes
app.use('/auth', authRouter)


// error handler middleware
//to be created


export default app