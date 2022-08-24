const Sequelize = require("sequelize")
const connection = require("../database/database")
const Category = require("../categories/Category")

const Article = connection.define("articles", {
    title: {
        type: Sequelize.STRING,
        allownull: false
    }, slug: {
        type: Sequelize.STRING,
        allownull: false
    }, body: {
        type: Sequelize.TEXT,
        allownull: false
    }
})

// criando o relacionamento
Category.hasMany(Article)
Article.belongsTo(Category)

// atualizando o banco de dados
// Article.sync({ force: true }) (apaga quando cria pela primeira vez)

module.exports = Article