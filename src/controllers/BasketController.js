const ApiError = require('../error/ApiError')
const jwt = require("jsonwebtoken");

const validatePizza = (pizzaDb, pizzaBasket) => {
    // let isValid = true
    //
    // isValid = pizzaBasket.name === pizzaDb.name
    //
    // const searchType = pizzaDb.types.find(item => item.id === pizzaBasket.type.id)
    // const searchSize = pizzaDb.sizes.find(item => item.id === pizzaBasket.size.id)
    //
    // Object.keys(pizzaBasket.type).forEach(key => {
    //     isValid = pizzaBasket.type[key] === searchType[key]
    // })
    //
    // Object.keys(pizzaBasket.size).forEach(key => {
    //     isValid = pizzaBasket.size[key] === searchSize[key]
    // })
    //
    // return isValid
}

const validateBasket = (pizzasDb, basket) => {
    // let valid = true
    //
    // basket.forEach((pizzaFromBask) => {
    //     const search = pizzasDb.find(item => item.id === pizzaFromBask.id)
    //     valid = validatePizza(search, pizzaFromBask)
    // })
    //
    // return valid
}

class BasketController {
    async update(req, res, next) {
        // try {
        //     const { basket } = req.body
        //     const user = req.user
        //
        //     const pizzas = await PizzaController.__getPizzas()
        //     const isValid = validateBasket(pizzas, basket)
        //
        //     const added = await Basket.create()
        //
        //     res.json(isValid)
        // } catch (e) {
        //     return next(ApiError.badRequest(e))
        // }
    }

    async payment(req, res, next) {
        // try {
        //
        // } catch (e) {
        //     return next(ApiError.badRequest(e))
        // }
    }

    async increment(req, res, next) {

    }

    async decrement(req, res, next) {

    }

    async clear(req, res, next) {

    }

    async getBask(req, res, next) {
        // const { basketId } = req.body
        // if (!basketId) return next(ApiError.badRequest('Нет обязательного параметра -:- basketId || products'))
        //
        // const basket = await Basket.findOne({
        //     where: {
        //         id: basketId
        //     }, attributes: ['id'], include: [Pizza]
        // })
        // res.json(basket)
    }

    async saveBasket(req, res, next) {
        // const { userId } = req.body
    }
}

/**
 * basket: [
 * {
 *     name: String
 *     img: String
 *     type: {
 *         id: number
 *         value: string
 *         price: number
 *     }
 * }
 * ]
 */

/**
 *
 * Нужно принять запрос.
 *
 * Проверить цены. Наличие типа, Наличие размера по имени/id
 *
 * Если все верно
 * - Отправить в ответ true
 * - Сохранить в корзину пользователя
 * -
 *
 * Если есть ошибки, отправить false
 */

module.exports = new BasketController()