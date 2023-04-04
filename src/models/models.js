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
    img: { type: DataTypes.STRING, allowNull: false },
})

const Type = sequelize.define('type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    value: { type: DataTypes.STRING, allowNull: false },
}, {timestamps: false})

const Size = sequelize.define('size', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    value: { type: DataTypes.INTEGER, allowNull: false },
}, {timestamps: false})

const Categories = sequelize.define('categories', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    value: { type: DataTypes.STRING, allowNull: false },
}, {timestamps: false})

const SizePizza = sequelize.define('pizza_size', {price: DataTypes.INTEGER}, { timestamps: false, unique: false });
const CategoriesPizza = sequelize.define('pizza_categories', {}, { timestamps: false, unique: false });
const TypePizza = sequelize.define('pizza_type', {price: DataTypes.INTEGER}, { timestamps: false, unique: false })
const PizzaBasket = sequelize.define('pizza_basket', {
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    img: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.STRING, allowNull: false },
    dough: { type: DataTypes.STRING, allowNull: false },
    count: { type: DataTypes.INTEGER, allowNull: false },
}, { unique: false })

Pizza.belongsToMany(Size, { through: SizePizza });
Pizza.belongsToMany(Categories, { through: CategoriesPizza });
Pizza.belongsToMany(Type, { through: TypePizza });

User.belongsTo(Basket)
Basket.belongsToMany(Pizza, { through: PizzaBasket })

module.exports = {
    User,
    Pizza,
    Type,
    Size,
    Basket,
    SizePizza,
    Categories,
    TypePizza,
    CategoriesPizza,
    PizzaBasket
}