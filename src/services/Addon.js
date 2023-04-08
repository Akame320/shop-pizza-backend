const ApiError = require('../error/ApiError')
const db = require("../models");
const { raw } = require("express");

class Addons {
    async #updateAddon(model, data) {
        const modelData = await model.findAll()

        if (modelData.length === 0) {
            return await model.bulkCreate(data)
        } else {
            return await data.forEach((item, idx) => {
                model[idx].update({ value: item.value })
            })
        }
    }

    async update(sizes = null, types = null, categories = null) {
        const payment = {}
        const out = {}

        if (sizes) payment.sizes = { ...sizes, valid: sizes.length >= 4 }
        if (types) payment.types = { ...types, valid: sizes.length >= 3 }
        if (categories) payment.categories = { ...categories, valid: categories.length <= 0 }

        if (payment.sizes && !payment.sizes.valid) return ApiError.badRequest('size.length > 3')
        if (payment.types && !payment.types.valid) return ApiError.badRequest('types.length > 2')
        if (payment.categories && !payment.categories.valid) return ApiError.badRequest('categories.length < 1')

        const categoriesCreate = categories.filter(item => {
            if (item.id) return -1
            else return 1
        })

        const categoriesUpdate = categories.filter(item => {
            if (item.id) return 1
            else return -1
        })

        try {
            await AddonCategories.update(categoriesUpdate)
            await AddonCategories.create(categoriesCreate)
            await this.#updateAddon(db.models.Types)
            await this.#updateAddon(db.models.Categories)

            out.sizes = await db.models.Sizes.findAll()
            out.types = await db.models.Types.findAll()
            out.categories = await db.models.Categories.findAll()

            return out
        } catch (e) {
            return ApiError.badRequest(e)
        }
    }

    async updatePizzaAddons(pizzaId, sizes, types, categories) {
        // await SizePizza.destroy({where: {pizzaId}})
        // await CategoriesPizza.destroy({where: {pizzaId}})
        // await TypePizza.destroy({where: {pizzaId}})
        //
        // const convertSize = sizes.map(item => ({pizzaId, sizeId: item.id, price: +item.price}))
        // const convertCategories = categories.map(item => ({pizzaId, categoryId: item}))
        // const convertTypes = types.map(item => ({pizzaId, typeId: item.id, price: +item.price}))
        //
        // await SizePizza.bulkCreate(convertSize)
        // await CategoriesPizza.bulkCreate(convertCategories)
        // await TypePizza.bulkCreate(convertTypes)
    }

    async findAll() {
       try {
           const sizes = await db.models.Size.findAll()
           const types = await db.models.Type.findAll()
           const categories = await db.models.Categories.findAll()

           return { sizes, types, categories }
       } catch (e) {
            return ApiError.badRequest(e)
       }
    }
}

class AddonSize {
    #maxRecords = 3

}

class AddonType {
    #maxRecords = 2

}

class AddonCategories {
    static async update(categories) {
        const state = []

        try {
            categories.forEach(item => {
                const out = db.models.Categories.update({
                    value: item.value,
                    title: item.title
                }, { where: { id: item.id } })
                state.push(out)
            })
        } catch (e) {
            return ApiError.forbidden(categories)
        }

        return await Promise.all(state);
    }

    static async create(categories) {
        try {
            db.models.Categories.bulkCreate(categories)
        } catch (e) {
            return ApiError.forbidden(categories)
        }
    }
}

module.exports = new Addons()