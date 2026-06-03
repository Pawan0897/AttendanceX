var express = require('express');
const { employeeAdd, loginEmployee, logoutEmployee } = require('../controller/employee_controller');
const upload = require('../multer/multer');
var router = express.Router();

router.post('/login-employee', loginEmployee);

// ************
router.post("/addemployee", upload.single("photo"), employeeAdd)
// *************************
router.post("/employeelogout", logoutEmployee);
// **********************

// ********************** admin or hr Login 

router.post("/login", userLogin);
router.post("/admin", adminRouter);



module.exports = router;
