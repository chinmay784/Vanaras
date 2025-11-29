const express = require("express");
const { createSuperAdmin, login, createDepartment, fetchAllDepartment, createHeadADepartment, fetchAllHeadDepartment, addEmployee, fetchAllEmployee, AssignWorkToEmployee, epartment_Head_Show_Assign_work_Employee, FetchLoginEmployeeWorkList, createProduct } = require("../controllers/UserController");
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
router.get("/epartment_Head_Show_Assign_work_Employee",authMiddelWere,epartment_Head_Show_Assign_work_Employee);
router.get("/FetchLoginEmployeeWorkList",authMiddelWere,FetchLoginEmployeeWorkList);
router.post("/createProduct",authMiddelWere,createProduct);

module.exports = router;