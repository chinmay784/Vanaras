const express = require("express");
const { createSuperAdmin, login, createDepartment, fetchAllDepartment, createHeadADepartment, fetchAllHeadDepartment, addEmployee, fetchAllEmployee, AssignWorkToEmployee } = require("../controllers/UserController");
const { authMiddelWere } = require("../middelWare/authMiddelWere");
const router = express.Router()

router.post("/createSuperAdmin", createSuperAdmin);
router.post("/login", login);
router.post("/createDepartment", authMiddelWere, createDepartment);
router.get("/fetchAllDepartment", fetchAllDepartment);
router.post("/createHeadADepartment", authMiddelWere, createHeadADepartment);
router.get("/fetchAllHeadDepartment",authMiddelWere,fetchAllHeadDepartment);
router.post("/addEmployee",authMiddelWere,addEmployee);
router.get("/fetchAllEmployee",authMiddelWere,fetchAllEmployee);
router.post("/AssignWorkToEmployee",authMiddelWere,AssignWorkToEmployee);

module.exports = router;