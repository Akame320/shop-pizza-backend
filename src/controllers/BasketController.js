const { Basket, PizzaBasket, Pizza } = require('../models/models')
const ApiError = require('../error/ApiError')

class BasketController {
    async update(req, res, next) {
        const { basketId, products } = req.body
        if (!basketId || !products) return next(ApiError.badRequest('Нет обязательного параметра -:- basketId || products'))

        const bulkProducts = products.map(product => {
            return { ...product, basketId }
        })

        const basket = await PizzaBasket.bulkCreate(bulkProducts)
        res.json({ message: 'Есть успех' })
    }

    async increment(req, res, next) {

    }

    async decrement(req, res, next) {

    }

    async clear(req, res, next) {

    }

    async getBask(req, res, next) {
        const { basketId } = req.body
        if (!basketId) return next(ApiError.badRequest('Нет обязательного параметра -:- basketId || products'))

        const basket = await Basket.findOne({
            where: {
                id: basketId
            }, attributes: ['id'], include: [Pizza]
        })
        res.json(basket)
    }
}

module.exports = new BasketController()