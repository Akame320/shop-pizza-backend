'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    User.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        email: { type: DataTypes.STRING, unique: true },
        password: { type: DataTypes.STRING },
        role: { type: DataTypes.STRING, defaultValue: 'USER' },
        token: { type: DataTypes.STRING},

        firstName: { type: DataTypes.STRING},
        lastName: { type: DataTypes.STRING},
        address: { type: DataTypes.STRING},
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};

/**
 * Алгоритм
 *
 * Если AT валиданый -> пропускаем
 * Если AT не валидный смотрим RT.
 * - Валидный ?
 * - -:- Перевыпускаем пару, удаляем старый RT -> сохраняем новый RT
 * - Нет
 * - -:- Удаляем оба -> Выкидываем из системы
 */