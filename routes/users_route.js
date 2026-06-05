var express = require('express');
const { loginEmployee, logoutEmployee } = require('../controller/employee_controller');
const upload = require('../multer/multer');
const { userLogin, userRegister, addEmployee } = require('../controller/user_controller');

const { Loginlimiter } = require('../middleware/rateLimiting');
const verifyToken = require('../middleware/auth.controller');
const { refreshTokenController } = require('../middleware/auth.refresh-token');
var router = express.Router();

// Login endpoint (no token required)
router.post('/login-employee', loginEmployee);

// ****************************************
// Protected route - requires token
router.post("/addemployee", verifyToken, upload.single("image"), addEmployee)
// *************************
// Protected route - requires token
router.post("/employeelogout", verifyToken, logoutEmployee);
// **********************

// ********************** admin or hr Login (no token required)

router.post("/login", userLogin);

// Protected route - requires token
router.post("/admin", verifyToken, upload.single("image"), userRegister);

router.post("/auth/refreshtoken", refreshTokenController)

module.exports = router;
