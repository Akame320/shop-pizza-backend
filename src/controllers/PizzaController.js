const { Pizza, Size, Type, Categories } = require('../models/models')
const ApiError = require('../error/ApiError')
const uuid = require('uuid')
const path = require('path')
const { where } = require("sequelize");
const fs = require("fs");
const Addons = require('../controllers/AddonController')

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

class PizzaController {
    async create(req, res, next) {
        try {
            const { name, sizes, types, categories } = req.body
            const { imgFile } = req.files
            let fileName = uuid.v4() + ".png"
            imgFile.mv(path.resolve(__dirname, '..', '..', 'static', fileName))

            const pizza = await Pizza.create({ name, img: fileName, price: 0 })

            await Addons.updatePizzaAddons(pizza.id, JSON.parse(sizes), JSON.parse(types), categories.split(','))
            const response = await Pizza.findAll({
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
                include: [Size, Type, Categories],
                order: [['name', 'ASC']],
            })

            const convertPizzas = formData(response)
            return res.json(convertPizzas)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        const pizzas = await Pizza.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            include: [Size, Type, Categories],
            order: [['name', 'ASC']],
        })


        const convertPizzas = formData(pizzas)
        return res.json(convertPizzas)
    }

    async getOne(req, res, next) {
        const { id } = req.params
        if (!id) return next(ApiError.badRequest('Нет обязательного параметра -:- id'))

        const pizza = await Pizza.findByPk(id)
        if (!pizza) return next(ApiError.badRequest(`Нет пиццы с id -:- ${id}`))
        res.json({ data: pizza })
    }


    async deleteOne(req, res, next) {
        const { id } = req.params
        let response = null
        try {
            const pizza = await Pizza.findByPk(id)
            await Pizza.destroy({ where: { id } })
            fs.unlinkSync(path.resolve(__dirname, '..', '..', 'static', pizza.img))
            response = await Pizza.findAll({
                order: [['name', 'ASC']],
                include: [Size, Type, Categories]
            })

        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }

        const convertPizzas = formData(response)
        res.json(convertPizzas)
    }

    async __getPizzas() {
        const pizzas = await Pizza.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            include: [Size, Type, Categories],
            order: [['name', 'ASC']],
        })
        return formData(pizzas)
    }
}

module.exports = new PizzaController()