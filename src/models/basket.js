'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Basket extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    Basket.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    }, {
        sequelize,
        modelName: 'Basket',
    });
    return Basket;
};