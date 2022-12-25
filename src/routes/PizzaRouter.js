const Router = require('express')
const router = new Router()

const pizzaController = require('../controllers/PizzaController')

router.post('/', pizzaController.create)
router.get('/', pizzaController.getAll)
router.get('/:id', pizzaController.getOne)

module.exports = router