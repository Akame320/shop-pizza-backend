const { Dough, DoughPizza } = require('../models/models')
const ApiError = require('../error/ApiError')

class DoughController {
    async create(req, res, next) {
        const { name } = req.body
        if (!name) return next(ApiError.badRequest(`Нет обязательного параметра -:- type`))

        const type = await Dough.create({ name })
        res.json({ message: 'Успешно добавлено', data: type })
    }

    async addToPizza(req, res, next) {
        const { pizzaId, doughId } = req.body
        if (!pizzaId || !doughId) return next(ApiError.badRequest('Нет обязательного параметра -:- pizzaId || doughId'))

        const dough = await DoughPizza.create({ pizzaId, doughId })
        res.json({message: 'Успешно добавлено', data: dough})
    }

    async getAll(req, res) {
        const doughs = await Dough.findAll()
        return res.json(doughs)
    }
}

module.exports = new DoughController()