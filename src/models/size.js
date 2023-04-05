'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Size extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {}
    }

    Size.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        value: { type: DataTypes.INTEGER, allowNull: false },
    }, {
        sequelize,
        modelName: 'Size',
        timestamps: false
    });
    return Size;
};