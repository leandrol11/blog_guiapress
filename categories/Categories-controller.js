const express = require("express")
// usa rounter pra criar rotas fora do arquivo principal
const router = express.Router()
const Category = require("./Category")
const slugify = require("slugify")
// usa body-parser pra conseguir enviar dados por aqui
const bodyParser = require('body-parser');
const adminAuth = require("../middleware/adminAuth")

// setando body-parser
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// carregando adm das categorias
router.get("/admin/categories/new", adminAuth, (req, res) => {
    res.render("admin/categories/new")
})

// salvando novas categorias
router.post("/categories/save", adminAuth, (req, res) => {
    let title = req.body.title
    if (title != undefined) {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories")
        })
    } else {
        res.redirect("/admin/categories/new")
    }
})

// listar categorias
router.get("/admin/categories", adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/categories/index", { categories: categories })
    })

})

// deletar uma categoria
router.post("/categories/delete", adminAuth, (req, res) => {
    let id = req.body.id
    if (id != undefined) {
        if (!isNaN(id)) {
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories")
            })
        } else {
            res.redirect("/admin/categories")
        }
    } else {
        res.redirect("/admin/categories")
    }
})

// carregar página de edição
router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {
    let id = req.params.id
    if (isNaN(id)) {
        res.redirect("/admin/categories")
    }
    Category.findByPk(id).then(category => {
        if (category != undefined) {
            res.render("admin/categories/edit", {
                category: category
            })
        } else {
            res.redirect("/admin/categories")
        }
    }).catch(error => {
        res.redirect("/admin/categories")
    })
})

router.post("/categories/update", adminAuth, (req, res) => {
    let id = req.body.id
    let title = req.body.title
    Category.update({ title: title, slug: slugify(title) }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/categories")
    })
})

module.exports = router