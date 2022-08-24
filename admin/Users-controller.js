const express = require("express")
const router = express.Router()
const User = require("./User")
const bcrypt = require("bcryptjs")
const slugify = require("slugify")
const adminAuth = require("../middleware/adminAuth")

router.get("/admin/users", adminAuth, (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", { users: users })
    })

})

router.get("/admin/users/create", adminAuth, (req, res) => {
    res.render("admin/users/create")
})

// criação usuário
router.post("/users/create", adminAuth, (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne({
        where: { email: email }
    }).then(user => {
        if (user == undefined) {
            let salt = bcrypt.genSaltSync(10)
            let hash = bcrypt.hashSync(password, salt)

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/admin/users")
            }).catch(() => {
                res.redirect("/admin")
            })
        } else {
            res.redirect("/admin/users/create")
        }
    })
})

//deletar usuário
router.post("/users/delete", adminAuth, (req, res) => {
    let id = req.body.id
    if (id != undefined) {
        if (!isNaN(id)) {
            User.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/users")
            })
        } else {
            res.redirect("/admin/users")
        }
    } else {
        res.redirect("/admin")
    }
})

// edição de usuário
router.get("/admin/users/edit/:id", adminAuth, (req, res) => {
    let id = req.params.id
    if (isNaN(id)) {
        res.redirect("/admin")
    }
    User.findByPk(id).then(user => {
        if (user != undefined) {
            res.render("admin/users/edit", {
                user: user
            })
        } else {
            res.redirect("/admin/users")
        }
    }).catch(error => {
        res.redirect("/admin")
    })
})

router.post("/users/update", adminAuth, (req, res) => {
    let id = req.body.id
    let email = req.body.email
    User.update({ email: email, slug: slugify(email) }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/users")
    })
})

// carregando login 
router.get("/login", (req, res) => {
    res.render("admin/users/login")
})

// fazer login
router.post("/authenticate", (req, res) => {
    let email = req.body.email
    let password = req.body.password

    // validação email e senha
    User.findOne({ where: { email: email } }).then(user => {
        if (user != undefined) {

            let correct = bcrypt.compareSync(password, user.password)
            if (correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin")
            } else {
                res.redirect("/login")
            }

        } else {
            res.redirect("/login")
        }
    })
})

//logout

router.get("/logout", (req, res) => {
    req.session.user = undefined
    res.redirect("/")
})

module.exports = router