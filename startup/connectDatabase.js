import mongoose from 'mongoose'
import logger from './logger.js'
import config from 'config'

const log = logger.child({module: 'connectDB'})
const dbConf = config.get('db')

export default function () {
    mongoose
    .connect(`mongodb://${dbConf.host}:${dbConf.port}/${dbConf.dbName}`, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(()=>{
        log.info('Successfully connected to MongoDB')
    })
    .catch((err)=>{
        log.info('Error connecting to MongoDB', err.message)
        process.exit(1)
    })
}