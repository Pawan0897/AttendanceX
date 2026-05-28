var express = require('express');
const { employeeAdd, loginEmployee, logoutEmployee } = require('../controller/employee_controller');
const upload = require('../multer/multer');
var router = express.Router();

router.post('/login', loginEmployee);

// ************
router.post("/addemployee", upload.single("photo"), employeeAdd)
// *************************
router.post("/employeelogout", logoutEmployee);

module.exports = router;
