'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Pizza extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static settingsForAddons = { timestamps: false, unique: false }
        static associate(models) {
            this.belongsToMany(models.Size, {through: 'SizePizza', ...this.settingsForAddons})
            this.belongsToMany(models.Border,  {through: 'BorderPizza', ...this.settingsForAddons})
            this.belongsToMany(models.Category,  {through: 'CategoryPizza', ...this.settingsForAddons})
        }
    }

    Pizza.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, unique: true, allowNull: false },
        img: { type: DataTypes.STRING, allowNull: false },
    }, {
        sequelize,
        modelName: 'Pizza',
    });
    return Pizza;
};