const Router = require('express')
const router = new Router()

const sizeController = require('../controllers/SizeController')

router.post('/update', sizeController.create)
router.get('/', sizeController.getAll)

module.exports = router