const Router = require('express')
const router = new Router()

const sizeController = require('../controllers/SizeController')

router.post('/create', sizeController.create)
router.post('/add', sizeController.addToPizza)
router.get('/', sizeController.getAll)

module.exports = router