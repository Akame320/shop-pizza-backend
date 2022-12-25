const Router = require('express')
const router = new Router()

const UserRouter = require('./UserRouter')
const DoughController = require('./DoughRouter')
const SizeRouter = require('./SizeRouter')
const CategoriesRouter = require('./CategoriesRouter')
const PizzaRouter = require('./PizzaRouter')
const BasketRouter = require('./BasketRouter')

router.use('/user', UserRouter)
router.use('/dough', DoughController)
router.use('/size', SizeRouter)
router.use('/categories', CategoriesRouter)
router.use('/pizza', PizzaRouter)
router.use('/basket', BasketRouter)

module.exports = router