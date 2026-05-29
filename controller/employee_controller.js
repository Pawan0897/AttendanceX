const bcrypt = require('bcrypt');
const EMPLOYEE_INFO_SCHEMA = require('../modal/employee_Modal');
const ATTENDACE = require('../modal/attendance_Modal');

// *******************************************************************
const loginEmployee = async (req, res) => {
    try {
        const { email, password } = req.body

        // 1. Email check
        const employee = await EMPLOYEE.findOne({ email: email.toLowerCase() })
        if (!employee) {
            return res.send({ statucode: 400, message: "Email is not valid !!!" })
        }

        // 2. Password check
        const isPass = await bcrypt.compare(password, employee.password)
        if (!isPass) {
            return res.send({ statucode: 400, message: "Password not matched !!!" })
        }

        // 3. Employee active mark karo
        await EMPLOYEE.updateOne(
            { _id: employee._id },
            { $set: { isActive: true } }
        )

        // 4. Attendance record banao
        const attendance = new ATTENDANCE({
            employeeId: employee.employeeId,
            date: moment().format('MMMM Do YYYY'),
            loginTime: moment().format('MMMM Do YYYY, h:mm:ss a'),
            status: 'present',
            loginIP: req.ip || null
        })

        const saved = await attendance.save()

        // 5. Response bhejo — attendanceId zaroori hai frontend ke liye
        return res.send({
            statucode: 200,
            message: "Welcome Back !!!",
            data: {
                attendanceId: saved._id,            // ← electron ko chahiye
                employeeId: employee.employeeId,
                fullName: employee.fullName,
                loginTime: saved.loginTime,
                date: saved.date
            }
        })

    } catch (error) {
        console.error('Login error:', error)
        return res.send({ statucode: 500, message: "Server error !!!", error })
    }
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
    try {
        const { attendanceId, employeeId, totalSeconds } = req.body

        if (!attendanceId || !employeeId) {
            return res.send({
                statucode: 400,
                message: "attendanceId aur employeeId required hain !!!"
            })
        }

        const updated = await ATTENDACE.findByIdAndUpdate(
            attendanceId,
            {
                $set: {
                    logoutTime: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    totalSeconds: totalSeconds || 0,
                    totalHours: moment.duration(totalSeconds || 0, 'seconds').humanize(),
                    status: (totalSeconds || 0) < 14400 ? 'half day' : 'present'
                }
            },
            { new: true }
        )

        if (!updated) {
            return res.send({
                statucode: 404,
                message: "Attendance record nahi mila !!!"
            })
        }

        // Employee inactive mark karo
        await EMPLOYEE_INFO_SCHEMA.updateOne(
            { employeeId },
            { $set: { isActive: false } }
        )

        return res.send({
            statucode: 200,
            message: "Logout successful !!!",
            data: {
                employeeId: updated.employeeId,
                date: updated.date,
                loginTime: updated.loginTime,
                logoutTime: updated.logoutTime,
                totalHours: updated.totalHours,
                status: updated.status
            }
        })

    } catch (err) {
        console.error('Logout error:', err)
        return res.send({
            statucode: 500,
            message: "Server error !!!"
        })
    }
}

module.exports = { employeeAdd, loginEmployee, logoutEmployee }