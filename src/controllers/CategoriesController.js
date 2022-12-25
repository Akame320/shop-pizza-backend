const { Categories, CategoriesPizza } = require('../models/models')
const ApiError = require('../error/ApiError')

class CategoriesController {
    async create(req, res, next) {
        const { name } = req.body
        if (!name) return next(ApiError.badRequest('Нет обязательного атрибута -:- name'))

        const createdCategories = await Categories.create({ name })
        res.json({ message: 'Успешно добавлено', data: createdCategories })
    }

    async addToPizza(req, res, next) {
        const { pizzaId, categoryId } = req.body
        if (!pizzaId && !categoryId) return next(ApiError.badRequest('нет обязательного аттрибута -:- pizzaId || categoryId'))

        const categories = await CategoriesPizza.create({ pizzaId, categoryId })
        res.json({ message: 'Успешно добавлено', data: categories })
    }

    async getAll(req, res, next) {
        const categories = await Categories.findAll({
            attributes: ['id', 'name'],
        })
        res.json(categories)
    }
}

module.exports = new CategoriesController()