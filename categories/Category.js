const Sequelize = require("sequelize")
const connection = require("../database/database")

const Category = connection.define("categories", {
    title: {
        type: Sequelize.STRING,
        allownull: false
    }, slug: {
        type: Sequelize.STRING,
        allownull: false
    }
})

// atualizando o banco de dados
// Category.sync({ force: true }) (apaga quando cria pela primeira vez)

module.exports = Category