const Router = require('express')
const router = new Router()

const UserRouter = require('./UserRouter')
const PizzaRouter = require('./PizzaRouter')
const BasketRouter = require('./BasketRouter')
const AddonRouter = require('./AddonRouter')

router.use('/user', UserRouter)

router.use('/pizza', PizzaRouter)
router.use('/basket', BasketRouter)
router.use('/addon', AddonRouter)

module.exports = router