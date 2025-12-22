const express = require("express");
const { createSuperAdmin, login, createDepartment, fetchAllDepartment, createHeadADepartment, fetchAllHeadDepartment, addEmployee, fetchAllEmployee, AssignWorkToEmployee, epartment_Head_Show_Assign_work_Employee, FetchLoginEmployeeWorkList, createProduct, fetchProduct, addBarCode, fetchAllBarCodeIMEINo, veriFyImeiNoAgain, addSolderingDetails, fetchSolderingDetailsandImeiNo, verifySolderingDetails, addBatteryConnectionDetails, fetchBatteryConnectionDetails, createFirmWare, fetchFirmWareDetails, QualityCheck, FetchallQualityCheck, getTodayFirmwareReport, showAllDateReports, fetchQCReport } = require("../controllers/UserController");
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
router.get("/fetchProduct",authMiddelWere,fetchProduct);

router.post("/addBarCode",authMiddelWere,addBarCode);
router.get("/fetchAllBarCodeIMEINo",authMiddelWere,fetchAllBarCodeIMEINo);
router.post("/veriFyImeiNoAgain",authMiddelWere,veriFyImeiNoAgain);
router.post("/addSolderingDetails",authMiddelWere,addSolderingDetails);
router.get("/fetchSolderingDetailsandImeiNo",authMiddelWere,fetchSolderingDetailsandImeiNo);
router.post("/verifySolderingDetails",authMiddelWere,verifySolderingDetails);
router.post("/addBatteryConnectionDetails",authMiddelWere,addBatteryConnectionDetails);
router.get("/fetchBatteryConnectionDetails",authMiddelWere,fetchBatteryConnectionDetails);
router.post("/createFirmWare",authMiddelWere,createFirmWare);
router.get("/fetchFirmWareDetails",authMiddelWere,fetchFirmWareDetails);
router.post("/QualityCheck",authMiddelWere,QualityCheck);
router.get("/FetchallQualityCheck",authMiddelWere,FetchallQualityCheck);
router.get("/getTodayFirmwareReport",authMiddelWere,getTodayFirmwareReport);
router.post("/showAllDateReports",authMiddelWere,showAllDateReports);
router.post("/fetchQCReport",authMiddelWere,fetchQCReport)

module.exports = router;