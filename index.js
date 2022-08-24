const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const session = require("express-session")

const connection = require("./database/database")

const CategoriesController = require("./categories/Categories-controller")
const ArticlesController = require("./articles/Articles-controller")
const UsersController = require("./admin/Users-controller")

const Article = require("./articles/Article")
const Category = require("./categories/Category")
const User = require("./admin/user")

//carregando ejs
app.set("view engine", "ejs")

//carregando arquivos estáticos
app.use(express.static("public"))

//carregando body-parser (pegar dados do body do html)
app.unsubscribe(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// configurando sessões
app.use(session({
    secret: "qualquercoisa",
    cookie: { maxAge: 300000 }
}))

//carregando database
connection.authenticate()
    .then(() => {
        console.log("Database ta rodando")
    }).catch((error) => {
        console.log(error)
    })

// carregando a página
app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ["id", "DESC"]
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", { articles: articles, categories: categories })
        })

    })

})

// carregando admin
app.get("/admin", (req, res) => {
    res.render("admin/admin")
})

//carregando rotas de outras pastas
app.use("/", CategoriesController)
app.use("/", ArticlesController)
app.use("/", UsersController)

//carregando rotas do session


app.get("/:slug", (req, res) => {
    let slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", { article: article, categories: categories })
            })
        } else {
            res.redirect("/")
        }
    }).catch(error => {
        res.redirect("/")
    })
})

app.get("/category/:slug", (req, res) => {
    let slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{ model: Article }]
    }).then(category => {
        if (category != undefined) {
            Category.findAll().then(categories => {
                res.render("index", { articles: category.articles, categories: categories })
            })
        } else {
            res.redirect("/")
        }
    }).catch(error => {
        res.redirect("/")
    })
})

app.listen(8080, () => {
    console.log("Página ta rodando")
})