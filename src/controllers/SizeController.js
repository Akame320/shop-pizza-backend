const { Size, SizePizza } = require('../models/models')
const ApiError = require('../error/ApiError')

class SizeController {
    async create(req, res, next) {
        const { name } = req.body
        if (!name) return next(ApiError.badRequest('Нет обязательного параметра -:- name'))

        const size = await Size.create({ name })
        res.json({ message: 'Успешно добавлено', data: size })
    }

    async sizesAddTo(pizzaId, sizesId, next) {
        if (!pizzaId || !sizesId) return next(ApiError.badRequest('Нет обязательного параметра -:- pizzaId'))

        const sizes = await SizePizza.findAll({
            where: {
                pizzaId
            }
        })
        for (const size of sizes) await size.destroy()
        const convertSizes = sizesId.map(size => ({ pizzaId, sizeId: size }))
        await SizePizza.bulkCreate(convertSizes)
    }

    async getAll(req, res) {
        const name = await Size.findAll({
            attributes: [['name', 'title'], ['id', 'value']]
        })
        return res.json(name)
    }
}

module.exports = new SizeController()