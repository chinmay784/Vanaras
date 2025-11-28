const express = require("express");
const { createSuperAdmin, login, createDepartment, fetchAllDepartment, createHeadADepartment, fetchAllHeadDepartment } = require("../controllers/UserController");
const { authMiddelWere } = require("../middelWare/authMiddelWere");
const router = express.Router()

router.post("/createSuperAdmin", createSuperAdmin);
router.post("/login", login);
router.post("/createDepartment", authMiddelWere, createDepartment);
router.get("/fetchAllDepartment", fetchAllDepartment);
router.post("/createHeadADepartment", authMiddelWere, createHeadADepartment);
router.get("/fetchAllHeadDepartment",authMiddelWere,fetchAllHeadDepartment);

module.exports = router;