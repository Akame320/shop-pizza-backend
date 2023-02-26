const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const { User, Basket } = require('../models/models')
const jwt = require('jsonwebtoken')

function generateToken(id, email, role) {
    return jwt.sign({ id, email, role }, 'pizzaSecret')
}

class UserController {
    async registration(req, res, next) {
        const { email, password, role } = req.body
        if (!email || !password) return next(ApiError.badRequest('Нет параметра -:- Password или Email'))

        const candidate = await User.findOne({
            where: { email }
        })
        if (candidate) return next(ApiError.badRequest('Пользователь с таким email уже существует'))

        const hashPassword = await bcrypt.hash(password, 5)
        const basket = await Basket.create()
        const user = await User.create({ email, role, password: hashPassword, basketId: basket.id })

        const token = generateToken(user.id, user.email, user.role)
        res.json({ token, user })
    }

    async login(req, res, next) {
        const { email, password } = req.body
        if (!email || !password) return next(ApiError.badRequest('Нет параметра -:- Password или Email'))

        try {
            const user = await User.findOne({ where: { email } })
            if (!user) return next(ApiError.badRequest(`Пользователя с email - ${email} не существует`))

            const validatePassword = bcrypt.compareSync(password, user.password)
            if (!validatePassword) return next(ApiError.badRequest('Пароль не правильный'))

            const token = generateToken(user.id, user.email, user.role)
            res.json({ token, user })
        } catch (e) {
            next(ApiError.badRequest(e))
        }
    }

    async check(req, res, next) {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) return next(ApiError.badRequest('Нет токена!'))

        const decoded = jwt.verify(token, 'pizzaSecret')
        const user = await User.findByPk(decoded.id)
        res.json(user)
    }
}

module.exports = new UserController()