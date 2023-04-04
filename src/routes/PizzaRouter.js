const Router = require('express')
const router = new Router()

const ProductController = require('../services/Products')

router.post('/', ProductController.create)
router.put('/', ProductController.update)
router.get('/', ProductController.get)
router.get('/:id', ProductController.get)
router.delete('/:id', ProductController.delete)

module.exports = router