const { Dough, DoughPizza } = require('../models/models')
const ApiError = require('../error/ApiError')

class DoughController {
    async create(req, res, next) {
        const { name } = req.body
        if (!name) return next(ApiError.badRequest(`Нет обязательного параметра -:- type`))

        const type = await Dough.create({ name })
        res.json({ message: 'Успешно добавлено', data: type })
    }

    async doughsAddTo(pizzaId, doughsId, next) {
        if (!pizzaId || !doughsId) return next(ApiError.badRequest('Нет обязательного параметра -:- pizzaId'))

        const doughs = await DoughPizza.findAll({
            where: {
                pizzaId
            }
        })
        for (const dough of doughs) await dough.destroy()
        const convertDoughs = doughsId.map(dough => ({ pizzaId, doughId: dough }))
        await DoughPizza.bulkCreate(convertDoughs)
    }

    async getAll(req, res) {
        const doughs = await Dough.findAll({
            attributes: [['name', 'title'], ['id', 'value']]
        })
        return res.json(doughs)
    }
}

module.exports = new DoughController()