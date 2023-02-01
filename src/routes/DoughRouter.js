const Router = require('express')
const router = new Router()
const checkRole = require('../middleware/CheckRoleMiddleware')

const doughController = require('../controllers/DoughController')

router.post('/update', checkRole('ADMIN'), doughController.create)
router.get('/', doughController.getAll)

module.exports = router