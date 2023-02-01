const { Pizza, Size, Dough, Categories } = require('../models/models')
const ApiError = require('../error/ApiError')
const uuid = require('uuid')
const path = require('path')
const { where } = require("sequelize");
const fs = require("fs");
const CategoriesController = require("./CategoriesController")
const SizeController = require("./SizeController")
const DoughController = require("./DoughController")

class PizzaController {
    async create(req, res, next) {
        try {
            const { name, price } = req.body
            const { img } = req.files
            let fileName = uuid.v4() + ".png"
            img.mv(path.resolve(__dirname, '..', '..', 'static', fileName))

            const pizza = await Pizza.create({ name, price, img: fileName })
            return res.json(pizza)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        const pizzas = await Pizza.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            include: [Size, Dough, Categories],
            order: [['name', 'ASC']],
        })
        return res.json(pizzas)
    }

    async getOne(req, res, next) {
        const { id } = req.params
        if (!id) return next(ApiError.badRequest('Нет обязательного параметра -:- id'))

        const pizza = await Pizza.findByPk(id)
        if (!pizza) return next(ApiError.badRequest(`По id - ${id} ничего найти не удалось`))
        res.json({ data: pizza })
    }

    async updateOne(req, res, next) {
        const { id, name, price, categoriesId, sizesId, doughsId } = req.body
        const { img } = req.files || ''

        if (!id) return next(ApiError.badRequest('Нет id'))

        const pizza = await Pizza.findByPk(id)
        if (!pizza) return next(ApiError.badRequest('Нет пиццы с id -:- ' + id))

        let fileName = pizza.img

        if (img) {
            const oldImg = pizza.img
            fs.unlink(path.resolve(__dirname, '..', '..', 'static', oldImg), (err) => {
                if (err) return next(ApiError.badRequest(err))
            })

            fileName = uuid.v4() + ".png"
            img.mv(path.resolve(__dirname, '..', '..', 'static', fileName))
        }

        await Pizza.update(
            { name, price, img: fileName },
            { where: { id } }
        )

        console.log('Yeeess')

        await CategoriesController.categoriesAddTo(id, categoriesId.split(','), next)

        console.log('Yeeess 1')
        await SizeController.sizesAddTo(id, sizesId.split(','), next)

        console.log('Yeeess 2')
        await DoughController.doughsAddTo(id, doughsId.split(','), next)

        console.log('Yeeess 3')
        const pizzas = await Pizza.findAll({
            order: [['name', 'ASC']],
            include: [Size, Dough, Categories]
        })

        return res.json(pizzas)
    }
}

module.exports = new PizzaController()