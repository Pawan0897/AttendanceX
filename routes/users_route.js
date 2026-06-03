var express = require('express');
const { employeeAdd, loginEmployee, logoutEmployee } = require('../controller/employee_controller');
const upload = require('../multer/multer');
const { userLogin, adminRouter } = require('../controller/user_dashboard_controller');
const verifyToken = require('../middleware/middleware');
var router = express.Router();

// Login endpoint (no token required)
router.post('/login-employee', loginEmployee);

// ************
// Protected route - requires token
router.post("/addemployee", verifyToken, upload.single("photo"), employeeAdd)
// *************************
// Protected route - requires token
router.post("/employeelogout", logoutEmployee);
// **********************

// ********************** admin or hr Login (no token required)

router.post("/login", userLogin);

// Protected route - requires token
router.post("/admin", verifyToken, adminRouter);



module.exports = router;
