const { Size, SizePizza } = require('../models/models')
const ApiError = require('../error/ApiError')

class SizeController {
    async create(req, res, next) {
        const { name } = req.body
        if (!name) return next(ApiError.badRequest('Нет обязательного параметра -:- name'))

        const size = await Size.create({ name })
        res.json({ message: 'Успешно добавлено', data: size })
    }

    async addToPizza(req, res, next) {
        const { pizzaId, sizeId } = req.body
        if (!pizzaId || !sizeId) return next(ApiError.badRequest('Нет обязательного параметра -:- pizzaId || sizeId'))

        const sdfsdf = await SizePizza.create({ pizzaId, sizeId })
        res.json({ message: 'Успешно добавлено', data: sdfsdf })
    }

    async getAll(req, res) {
        const name = await Size.findAll()
        return res.json(name)
    }
}

module.exports = new SizeController()