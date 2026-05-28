const bcrypt = require('bcrypt');
const EMPLOYEE_INFO_SCHEMA = require('../modal/employee_Modal');
const ATTENDACE = require('../modal/attendance_Modal');

// *******************************************************************
const loginEmployee = async (req, res) => {
    const { email, password } = req.body;
    const isEmailExist = await EMPLOYEE_INFO_SCHEMA.findOne({ email: email });

    if (!isEmailExist) {
        return {
            statucode: 400,
            message: "Emial is not Valid !!!",
        }
    }
    const isPass = await bcrypt.compare(password, isEmailExist?.password)
    if (!isPass) {
        return {
            statucode: 400,
            message: "Password not matched !!!",
        }
    }

    await EMPLOYEE_INFO_SCHEMA.updateOne({ employeeId: isEmailExist?.employeeId }, { $set: { isActive: true } }, { new: true })
    // *********** abb attendance time star
    const atteendanceData = new ATTENDACE({

        loginTime: new Date(),
        status: "present",
        date: new Date()

    })
    const data = await atteendanceData.save();
    return res.send({
        statucode: 200,
        message: "Welcome Back !!!",
        data: data
    })


}

// *******************************************************************
const employeeAdd = async (req, res) => {
    const { employeeId, fullName, phone, role, desgination, isActive, joiningDate, salary, email, password } = req.body;
    const photo = req.file;
    const Email = email.toLowerCase();
    const isemailExist = await EMPLOYEE_INFO_SCHEMA.findOne({ email: Email });
    const isEmployeeExist = await EMPLOYEE_INFO_SCHEMA.findOne({ employeeId });
    const hashPasssword = await bcrypt.hash(password, 10);
    try {
        // if (role === "hr") {
        if (isemailExist) {
            return res.send({
                statuscode: 409,
                message: "This Email is Already Exist !!!",
            })
        }
        else if (isEmployeeExist) {
            return res.send({
                statuscode: 409,
                message: "This Email is Already Exist !!!",
            })
        }

        else {
            const data = new EMPLOYEE_INFO_SCHEMA({
                employeeId,
                fullName,
                phone,
                photo,
                role,
                desgination,
                isActive,
                joiningDate,
                salary,
                email,
                password: hashPasssword

            })
            const addEmployee = await data.save()

            return res.send({
                statuscode: 200,
                message: "Employee Addedd Successflly !!!"
            })
        }
        // }
        // else {
        //     return res.send({
        //         statucode: 400,
        //         message: "No Permission  !!!"
        //     })
        // }

    } catch (error) {
        return res.send({
            statucode: 500,
            message: "server error !!!", error
        })
    }
}
// ******************************************
const logoutEmployee = async (req, res) => {
    const { employeeId, loginTime, logoutTime, totalHours } = req.body;
    try {
        if (!employeeId) {
            return res.send({
                statuscode: 400,
                message: "Employee required !!!"
            })

        }
        const today = new Date();
        today.setHours(0, 0, 0, 0)
        const data = ATTENDACE.findByIdAndUpdate({ employeeId: employeeId, date: { $gte: today } }, { $set: { loginTime: loginTime, logoutTime: logoutTime, totalHours: totalHours } }, { new: true })
        if (!data) {
            return res.send({
                statuscode: 404,
                message: "attendance data not found !!!"
            })
        }
    }
    catch (err) {
        return res.send({
            statucode: 500,
            message: "server Error !!!"
        })
    }

}

module.exports = { employeeAdd, loginEmployee, logoutEmployee }