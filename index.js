require('dotenv').config()
const { sequelize } = require('./src/models/index')
const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const router = require('./src/routes/index')
const path = require('path')
const errorHandler = require('./src/middleware/ErrorHandlingMiddleware')
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors({credentials: true, origin: 'http://localhost:5080'}))
app.use(cookieParser('HollaOllaLololo'));
app.use(fileUpload({}))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use('/api', router)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header(
        'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization,  X-PINGOTHER'
    );
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
    next();
});
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
