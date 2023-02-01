const sequelize = require("../../db")
const { DataTypes } = require("sequelize")

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: 'USER' }
})

const Basket = sequelize.define('basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})


const Pizza = sequelize.define('pizza', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    img: { type: DataTypes.STRING, allowNull: false },
})

const Dough = sequelize.define('dough', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
}, {timestamps: false})

const Size = sequelize.define('size', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
}, {timestamps: false})

const Categories = sequelize.define('categories', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
}, {timestamps: false})

const SizePizza = sequelize.define('pizza_size', {price: DataTypes.INTEGER}, { timestamps: false, unique: false });
const CategoriesPizza = sequelize.define('pizza_categories', {}, { timestamps: false, unique: false });
const DoughPizza = sequelize.define('pizza_dough', {price: DataTypes.INTEGER}, { timestamps: false, unique: false })
const PizzaBasket = sequelize.define('pizza_basket', {
    size: { type: DataTypes.STRING, allowNull: false },
    dough: { type: DataTypes.STRING, allowNull: false },
    count: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: false, unique: false })

Pizza.belongsToMany(Size, { through: SizePizza });
Pizza.belongsToMany(Categories, { through: CategoriesPizza });
Pizza.belongsToMany(Dough, { through: DoughPizza });

User.belongsTo(Basket)
Basket.belongsToMany(Pizza, { through: PizzaBasket })

module.exports = {
    User,
    Pizza,
    Dough,
    Size,
    Basket,
    SizePizza,
    Categories,
    DoughPizza,
    CategoriesPizza,
    PizzaBasket
}