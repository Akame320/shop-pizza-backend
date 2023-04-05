require('dotenv').config()
const { sequelize } = require('./src/models/index')
const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const router = require('./src/routes/index')
const path = require('path')
const errorHandler = require('./src/middleware/ErrorHandlingMiddleware')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(fileUpload({}))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use('/api', router)
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync()

        console.log('////////////////////////////////////////////////////////////////////');
        console.log('DB -:- Connection has been established successfully.');
    } catch (error) {
        console.log('?????????????????????????????????????????????????????????????????????');
        console.error('ERROR -:- Unable to connect to the database:', error);
    }

    try {
        app.listen(PORT, () => {
            console.log('SERVER -:- Server started in port = ' + PORT)
            console.log('////////////////////////////////////////////////////////////////////');
        })
    } catch (error) {
        console.error('ERROR -:- Unable to start server:', error);
        console.log('?????????????????????????????????????????????????????????????????????');
    }
}

start()
