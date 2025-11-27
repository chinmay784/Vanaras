const express = require("express");
const { createSuperAdmin, login } = require("../controllers/UserController");
const router = express.Router()

router.post("/createSuperAdmin",createSuperAdmin);
router.post("/login",login);

module.exports = router;