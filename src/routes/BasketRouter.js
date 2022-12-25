const Router = require('express')
const   router = new Router()

const BasketController = require('../controllers/BasketController')

router.post('/increment', BasketController.increment)
router.post('/decrement', BasketController.decrement)
router.post('/clear', BasketController.clear)
router.post('/update', BasketController.update)
router.post('/get', BasketController.getBask)

module.exports = router