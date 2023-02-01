const Router = require('express')
const router = new Router()

const CategoriesController = require('../controllers/CategoriesController')

router.post('/update', CategoriesController.create)
router.get('/', CategoriesController.getAll)

module.exports = router