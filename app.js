const express = require('express')
const cors = require('cors')
const app = express()
const auth = require('./routes/auth')
const users = require('./routes/users')
require('dotenv').config()
const AuthChecker = require('./middleware/AuthChecker')
const logger = require('./logger')
const httpLogger = require("./httplogger")
const connectDB = require('./db/connect')
const body_parser = require('body-parser');


//middleware
app.use(cors())
app.use(express.json())
app.use(httpLogger)
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));

//routes
app.use('/api/feedback/authentication', auth)
app.use('/api/feedback', AuthChecker, users)

//ports and server start
const port = process.env.PORT

const start = async () => {
    try {

        await connectDB.getConnection(function(err, connection) {
            if (err) {// not connected!
                logger.error(`db not connected....`)
                process.exit()
            }else {
                logger.info(`Database connected...`)
                app.listen(port, logger.info(`Server listening on port ${port}....`))   
            }        
          });
        
    } catch (error) {
        logger.error(error)
        process.exit()
    }    
}

start()