const { Sequelize } = require('sequelize')

module.exports = new Sequelize('smart_phone', 'postgres', 'root', {
    host: 'db',
    dialect: 'postgres'
});