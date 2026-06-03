const express = require("express");
const { getAllEmployee } = require("../controller/employee_controller");
const router = express.Router();

router.get("/all", getAllEmployee);
router.get("/employe/:id", getEmployee)
