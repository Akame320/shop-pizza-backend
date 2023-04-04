const { Pizza, Size, Type, Categories } = require("../models/models");
const fs = require("fs");
const path = require("path");
const ApiError = require("../error/ApiError");
const uuid = require("uuid");
const Addons = require("../controllers/AddonController");
const formData = (data) => {
    return data.map(item => {
        return {
            id: item.id,
            name: item.name,
            img: item.img,
            sizes: item.sizes.map(itemSize => {
                return {
                    id: itemSize.id,
                    value: itemSize.value,
                    price: itemSize.pizza_size.dataValues.price
                }
            }),
            types: item.types.map(itemType => {
                return {
                    id: itemType.id,
                    value: itemType.value,
                    price: itemType.pizza_type.dataValues.price
                }
            }),
            categories: item.categories.map(itemCategory => (itemCategory.id))
        }
    })
}

class PizzaService {
    constructor() {
    }

    #settings = {
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        },
        include: [Size, Type, Categories],
        order: [['name', 'ASC']],
    }

    async get(id = false) {
        let out = null

        if (id) {
            out = await Pizza.findByPk(id)
        } else {
            out = await Pizza.findAll(this.#settings)
        }

        return formData(out)
    }

    async deletePizza(id) {
        try {
            const pizza = await Pizza.findByPk(id)
            await Pizza.destroy({ where: { id } })
            fs.unlinkSync(path.resolve(__dirname, '..', '..', 'static', pizza.img))

            return this.get()
        } catch (e) {
            return ApiError.badRequest(e)
        }
    }

    async create(data, img) {
        const requreParams = ['name', 'sizes', 'types', 'categories', 'imgFile']
        const validateData = Object.keys({ ...data, ...img }).map(item => {
            return requreParams.includes(item)
        })
        if (validateData.length !== requreParams.length) return ApiError.badRequest('Invalid object for new pizza')


        const { name } = data
        const { imgFile } = img
        const types = JSON.parse(data.types)
        const sizes = JSON.parse(data.sizes)
        const categories = data.categories.split(',')


        const fileName = await this.#createImg(imgFile)
        if (fileName instanceof ApiError) return fileName

        try {
            const newPizza = await Pizza.create({ name, img: fileName })
            await Addons.updatePizzaAddons(newPizza.id, sizes, types, categories)

            return await this.get()
        } catch (e) {
            return ApiError.badRequest(e.message)
        }
    }

    async updateOne(data, img) {
        const requreParams = ['id']
        const dataForValidate = Object.keys(data)
        const validateData = requreParams.map(item => {
            return dataForValidate.includes(item)
        })
        if (validateData.length !== requreParams.length) return ApiError.badRequest('Invalid object for new pizza')


        const { id } = data
        const { name } = data || null
        const imgFile = img ?? null
        const types = JSON.parse(data.types) || null
        const sizes = JSON.parse(data.sizes) || null
        const categories = data.categories.split(',') || null

        const payment = {} // Object for combine new properties for update Pizza


        const pizza = await Pizza.findByPk(id)
        if (!pizza) return ApiError.badRequest('Not pizza for id -:- ' + id)

        if (imgFile) {
            let oldImgName = pizza.img
            const newImgName = await this.#updateImg(oldImgName, imgFile)
            if (newImgName instanceof ApiError) return ApiError.badRequest(newImgName)

            payment.img = newImgName
        }

        if (types || sizes || categories) {
            try {
                await Addons.updatePizzaAddons(id, sizes, types, categories)
            } catch (e) {
                return ApiError.badRequest(e)
            }
        }

        if (name) {
            payment.name = name
        }

        await Pizza.update(payment, { where: { id } })
        return await this.get()
    }

    async #createImg(img) {
        try {
            let name = uuid.v4() + ".png"
            img.mv(path.resolve(__dirname, '..', '..', 'static', name))

            return name
        } catch (e) {
            return ApiError.badRequest(e)
        }
    }

    async #updateImg(oldImgName, newImgFile) {
        try {
            fs.unlink(path.resolve(__dirname, '..', '..', 'static', oldImgName))
            const newFilename = uuid.v4() + ".png"
            await newImgFile.mv(path.resolve(__dirname, '..', '..', 'static', newFilename))

            return newFilename
        } catch (e) {
            return ApiError.badRequest(e)
        }
    }
}

class ProductController {
    constructor() {
    }

    async getId(req, res, next) {
        const { id } = req.params
        if (!id) return next(ApiError.badRequest('Not Id'))

        const out = new PizzaService().get(id)
        if (out instanceof ApiError) return next(ApiError.badRequest(out))

        res.json(out)
    }

    async get(req, res, next) {
        const out = await new PizzaService().get()
        if (out instanceof ApiError) return next(ApiError.badRequest(out))

        res.json(out)
    }

    async delete(req, res, next) {
        const { id } = req.params
        if (!id) return next(ApiError.badRequest('Not Id'))

        const out = new PizzaService().deletePizza(id)
        if (out instanceof ApiError) return next(ApiError.badRequest(out))

        res.json(out)
    }

    async create(req, res, next) {
        const pizzaData = req.body
        const pizzaImg = req.files
        if (!pizzaData || !pizzaImg) return next(ApiError.badRequest('Not require params'))

        const out = await new PizzaService().create(pizzaData, pizzaImg)
        if (out instanceof ApiError) return next(ApiError.badRequest(out))

        res.json(out)
    }

    async update(req, res, next) {
        const { id } = req.body
        const pizzaData = req.body
        const pizzaImg = req.files
        if (!id) return next(ApiError.badRequest('Not id'))

        const out = await new PizzaService().updateOne(pizzaData, pizzaImg)
        if (out instanceof ApiError) return next(ApiError.badRequest(out))

        res.json(out)
    }
}

module.exports = new ProductController()
