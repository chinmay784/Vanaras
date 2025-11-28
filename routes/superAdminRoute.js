const express = require("express");
const { createSuperAdmin, login, createDepartment, fetchAllDepartment } = require("../controllers/UserController");
const { authMiddelWere } = require("../middelWare/authMiddelWere");
const router = express.Router()

router.post("/createSuperAdmin",createSuperAdmin);
router.post("/login",login);
router.post("/createDepartment",authMiddelWere,createDepartment);
router.get("/fetchAllDepartment",fetchAllDepartment)

module.exports = router;