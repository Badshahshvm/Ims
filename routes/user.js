const express = require("express");
const { signup, login, logout } = require("../controllers/user");
const checkAuth = require("../middlewares/checkAuth");

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

module.exports = router