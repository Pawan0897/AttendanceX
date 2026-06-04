var express = require('express');
const { loginEmployee, logoutEmployee } = require('../controller/employee_controller');
const upload = require('../multer/multer');
const { userLogin, userRegister, employeeAdd } = require('../controller/user_controller');
const verifyToken = require('../middleware/middleware');
const { Loginlimiter } = require('../middleware/rateLimiting');
var router = express.Router();

// Login endpoint (no token required)
router.post('/login-employee', loginEmployee);

// ************
// Protected route - requires token
router.post("/addemployee", verifyToken, upload.single("image"), employeeAdd)
// *************************
// Protected route - requires token
router.post("/employeelogout", verifyToken, logoutEmployee);
// **********************

// ********************** admin or hr Login (no token required)

router.post("/login", userLogin);

// Protected route - requires token
router.post("/admin", verifyToken, upload.single("image"), userRegister);



module.exports = router;
