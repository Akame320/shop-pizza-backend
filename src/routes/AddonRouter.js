const Router = require('express')
const router = new Router()
const checkRole = require('../middleware/CheckRoleMiddleware')
const AddonService = require('../services/Addon')
const ApiError = require("../error/ApiError");

class AddonsController {
    static async update(req, res, next) {
        // const out = AddonService.update(req.body.size, req.body.type, req.body.categories)
        // if (out instanceof ApiError) return next(ApiError.badRequest(out))

        res.json('')
    }

    static async get(req, res, next) {
        // const out = AddonService.findAll()
        // if (out instanceof ApiError) return next(ApiError.badRequest(out))
        //
        res.json('')
    }
}

router.post('/update', checkRole('ADMIN'), AddonsController.update)
router.get('/', AddonsController.get)

module.exports = router