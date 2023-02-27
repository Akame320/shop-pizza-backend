const { Size, SizePizza, Categories, CategoriesPizza, Type, TypePizza } = require('../models/models')
const ApiError = require('../error/ApiError')

class AddonController {
    async update(req, res, next) {
        const { sizes, categories, types } = req.body
        if (sizes.length >= 4) return next(ApiError.badRequest('size.length > 3'))
        if (types.length >= 3) return next(ApiError.badRequest('types.length > 2'))
        if (categories.length <= 0) return next(ApiError.badRequest('categories.length < 1'))

        const dbSizes = await Size.findAll()
        const dbTypes = await Type.findAll()
        const dbCategories = await Categories.findAll()

        let createdSizes = []
        let createdTypes = []
        let createdCategories = []

        if (dbSizes.length === 0) {
            createdSizes = await Size.bulkCreate(sizes)
        } else {
            sizes.forEach((size, idx) => {
                dbSizes[idx].update({ value: +size.value })
                createdSizes.push(dbSizes[idx])
            })
        }

        if (dbTypes.length === 0) {
            createdTypes = await Type.bulkCreate(types)
        } else {
            types.forEach((type, idx) => {
                dbTypes[idx].update({ value: type.value })
                createdTypes.push(dbTypes[idx])
            })
        }

        if (dbCategories.length === 0) {
            createdCategories = await Categories.bulkCreate(categories)
        }

        if (dbCategories.length !== 0) {
            const keysDb = categories.filter(item => (!!item.id))
            for (const item of keysDb) {
                await Categories.update({
                    value: item.value
                }, {where: {id: item.id}})
            }

            const keysLocal = categories.filter(item => (!item.id))
            await Categories.bulkCreate(keysLocal)
        }

        createdCategories = await Categories.findAll()


        res.json({
            sizes: [...createdSizes],
            categories: [...createdCategories],
            types: [...createdTypes]
        })
    }

    async updatePizzaAddons(pizzaId, sizes, types, categories) {
        await SizePizza.destroy({where: {pizzaId}})
        await CategoriesPizza.destroy({where: {pizzaId}})
        await TypePizza.destroy({where: {pizzaId}})

        const convertSize = sizes.map(item => ({pizzaId, sizeId: item.id, price: +item.price}))
        const convertCategories = categories.map(item => ({pizzaId, categoryId: item}))
        const convertTypes = types.map(item => ({pizzaId, typeId: item.id, price: +item.price}))

        await SizePizza.bulkCreate(convertSize)
        await CategoriesPizza.bulkCreate(convertCategories)
        await TypePizza.bulkCreate(convertTypes)
    }

    async findAll(req, res) {
        const dbSizes = await Size.findAll()
        const dbTypes = await Type.findAll()
        const dbCategories = await Categories.findAll({
            attributes: [['id', 'value'], ['value', 'title']],
        })

        res.json({
            sizes: [...dbSizes || []],
            types: [...dbTypes || []],
            categories: [...dbCategories || []],
        })
    }
}

module.exports = new AddonController()