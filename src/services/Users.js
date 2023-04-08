const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");
const { sequelize: db } = require("../models/index")
const bcrypt = require("bcrypt");

class UserService {
    #accessToken(data) {
        const exp = Math.floor(Date.now() / 1000) + (60 * 10)
        return jwt.sign({ ...data, exp }, 'pizzaSecret')
    }

    #refreshToken() {
        const exp = Math.floor(Date.now() / 1000) + (60 * 60 * 24)
        return jwt.sign({ exp }, 'SuperUpperPupperPizzaSecret')
    }

    async #getUser(query) {
        return await db.models.User.findOne({ where: query })
    }

    async registration(email, password, role = 'user') {
        const isEmailUsed = await this.#getUser({ email })
        if (isEmailUsed) return ApiError.badRequest('Email used')

        const basket = await db.models.Basket.create()
        const hashPassword = await bcrypt.hash(password, 5)
        const refreshToken = this.#refreshToken()
        const user = await db.models.User.create({
            email,
            role,
            password: hashPassword,
            basketId: basket.id,
            token: refreshToken
        })

        const token = this.#accessToken(user.id, user.email, user.role)

        return { data: user, token, refreshToken }
    }

    async login(email, password) {
        try {
            const userForAuth = await this.#getUser({ email })
            if (!userForAuth) return ApiError.badRequest(`Email user does not exist`)

            const checkPassword = bcrypt.compareSync(password, userForAuth.password)
            if (!checkPassword) return ApiError.badRequest('Incorrect password')

            const token = this.#accessToken(userForAuth.id, userForAuth.email, userForAuth.role)
            const refreshToken = this.#refreshToken()


            return { data: userForAuth, token, refreshToken }
        } catch (e) {
            return ApiError.badRequest(e)
        }
    }

    async logout(refreshToken) {
        try {
            const user = await db.models.User.findOne({ where: { token: refreshToken } })
            user.token = null
            user.save()

            return true
        } catch (e) {
            return ApiError.badRequest(e)
        }
    }

    async updateTokens(refreshToken) {
        try {
            const user = await this.#getUser({ token: refreshToken })
            user.token = this.#refreshToken()
            const accessToken = this.#accessToken(user.id, user.email, user.role)
            await user.save()

            return { access: accessToken, refresh: user.token }
        } catch (e) {
            return ApiError.badRequest(e)
        }
    }
}

module.exports = new UserService()
