const jwt = require('jsonwebtoken')
const ApiError = require("../error/ApiError");

module.exports = async function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) return res.status(401).json(ApiError.forbidden('No Auth'))
        req.user = jwt.verify(token, 'pizzaSecret')
        next()
    }catch (e) {
        return res.json(ApiError.forbidden(e))
    }
}