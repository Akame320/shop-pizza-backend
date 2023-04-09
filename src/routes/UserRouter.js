const Router = require('express')
const router = new Router()
const authMiddleWare = require('../middleware/AuthMiddleware')
const UserService = require('../services/Users')
const ApiError = require("../error/ApiError");
const jwt = require("jsonwebtoken");

class UserController {
    static async registration(req, res, next) {
        if (!req.body.email || !req.body.password) return next(ApiError.badRequest('Invalid data'))
        const { email, password, role, other } = req.body

        const user = await UserService.registration(email, password, role, other)
        if (user instanceof ApiError) return next(ApiError.badRequest(user))

        res.cookie('refreshToken', user.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false })
        res.json({ token: user.token, user: user.data })
    }

    static async login(req, res, next) {
        if (!req.body.email || !req.body.password) return next(ApiError.badRequest('Invalid data'))

        const user = await UserService.login(req.body.email, req.body.password)
        if (user instanceof ApiError) return next(ApiError.badRequest(user))

        res.cookie('refreshToken', user.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false })
        res.json({ token: user.token, user: user.data })
    }

    static async check(req, res, next) {
        const { refreshToken } = req.cookies
        const accessToken = req.headers.authorization.split(' ')[1]

        const checkValidAccess = jwt.verify(accessToken, 'pizzaSecret')
        const checkValidRefresh = jwt.verify(refreshToken, 'SuperUpperPupperPizzaSecret')

        if (checkValidAccess && checkValidRefresh) {
            res.send()
        }

        if (!checkValidRefresh) {
           next(this.logout)
        }

        if (!checkValidAccess) {
            const tokens = await UserService.updateTokens(refreshToken)
            if (tokens instanceof ApiError) return next(ApiError.badRequest(tokens))
            res.cookie('refreshToken', tokens.refresh, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false })
            res.json({ token: tokens.access })
        }
    }

    static async logout(req, res, next) {
        const { refreshToken } = req.cookies
        if (!refreshToken) res.send()

        const deletedToken = UserService.logout(refreshToken)
        if (deletedToken instanceof ApiError) return next(ApiError.badRequest(deletedToken))
        res.clearCookie('refreshToken')
        res.send()
    }

    static async test(req, res) {
        res.json({ message: 'Gooooooooooood !!!!!!' })
    }
}


router.post('/registration', UserController.registration)
router.post('/login', UserController.login)
router.get('/check', UserController.check)
router.get('/logout', UserController.logout)

module.exports = router