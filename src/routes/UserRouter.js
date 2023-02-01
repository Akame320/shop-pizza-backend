const Router = require('express')
const router = new Router()
const authMiddleWare = require('../middleware/AuthMiddleware')
const userController = require('../controllers/UserController')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/check', userController.check)

module.exports = router