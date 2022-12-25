const jwt = require('jsonwebtoken')

module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next()
        }

        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) return res.status(401).json({message: 'Пользователь не авторизован'})
            const decoded = jwt.verify(token, 'pizzaSecret')
            if (decoded.role !== role) return res.status(403).json({message: 'У вас нет доступа'})
            req.user = decoded
            next()
        }catch (e) {
            res.status(500).json({message: 'Ошибка сервера: ' + e})
        }
    }
}