const Sequelize = require("sequelize")
const connection = require("../database/database")

const User = connection.define("users", {
    email: {
        type: Sequelize.STRING,
        allownull: false
    }, password: {
        type: Sequelize.STRING,
        allownull: false
    }
})

// atualizando o banco de dados
// User.sync({ force: false }) (apaga quando cria pela primeira vez)

module.exports = User