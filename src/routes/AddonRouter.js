const Router = require('express')
const router = new Router()
const checkRole = require('../middleware/CheckRoleMiddleware')

const addonController = require('../controllers/AddonController')

router.post('/update', checkRole('ADMIN'), addonController.update)
router.get('/', addonController.findAll)

module.exports = router