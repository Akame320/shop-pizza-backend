const { Categories, CategoriesPizza } = require('../models/models')
const ApiError = require('../error/ApiError')

class CategoriesController {
    async create(req, res, next) {
        const { name } = req.body
        if (!name) return next(ApiError.badRequest('Нет обязательного атрибута -:- name'))

        const createdCategories = await Categories.create({ name })
        res.json({ message: 'Успешно добавлено', data: createdCategories })
    }

    async categoriesAddTo(pizzaId, categoriesId, next) {
        if (!pizzaId && !categoriesId) return next(ApiError.badRequest('нет обязательного аттрибута -:- pizzaId || itemsId'))

        const categories = await CategoriesPizza.findAll({
            where: {
                pizzaId
            }
        })

        for (const category of categories) await category.destroy()
        const convertCategories = categoriesId.map(item => ({ pizzaId, categoryId: item }))
        await CategoriesPizza.bulkCreate(convertCategories)
    }

    async getAll(req, res, next) {
        const categories = await Categories.findAll({
            attributes: ['id', 'name'],
        })
        res.json(categories)
    }
}

module.exports = new CategoriesController()