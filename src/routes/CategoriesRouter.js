const Router = require('express')
const router = new Router()

const CategoriesController = require('../controllers/CategoriesController')

router.post('/create', CategoriesController.create)
router.post('/add', CategoriesController.addToPizza)
router.get('/', CategoriesController.getAll)

module.exports = router