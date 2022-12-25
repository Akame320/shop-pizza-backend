const Router = require('express')
const router = new Router()
const checkRole = require('../middleware/CheckRoleMiddleware')

const doughController = require('../controllers/DoughController')

router.post('/create', checkRole('ADMIN'), doughController.create)
router.post('/add', checkRole('ADMIN'), doughController.addToPizza)
router.get('/', doughController.getAll)

module.exports = router