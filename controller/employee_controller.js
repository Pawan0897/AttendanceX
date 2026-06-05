const bcrypt = require('bcrypt');

const moment = require('moment-timezone');
const ATTENDACE = require('../models/attendance_Models');
// *******************************************************************
const loginEmployee = async (req, res) => {
    try {
        const { email, password } = req.body
        const employee = await USER.findOne({ email: email.toLowerCase() })
        if (!employee || employee?.role != "employee") {
            return res.send({ statucode: 400, message: "Email is not valid !!!" })
        }

        const isPass = await bcrypt.compare(password, employee.password)
        if (!isPass) {
            return res.send({ statucode: 400, message: "Password not matched !!!" })
        }

        await USER.updateOne(
            { _id: employee._id },
            { $set: { isActive: true } }
        )

        const attendance = new attendance_Models({
            employeeId: employee.employeeId,
            date: moment().tz('Asia/Kolkata').format('MMMM Do YYYY'),
            loginTime: moment().tz('Asia/Kolkata').format('MMMM Do YYYY, h:mm:ss a'),
            status: 'present',
            // loginIP: req.ip || null
        })

        const saved = await attendance.save()

        return res.send({
            statucode: 200,
            message: "Welcome Back !!!",
            data: {
                attendanceId: saved._id,
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

// ******************************************
const logoutEmployee = async (req, res) => {
    try {
        const { attendanceId, employeeId, totalSeconds } = req.body
        const totalHours = (totalSeconds || 0) / 3600
        if (!attendanceId || !employeeId) {
            return res.send({
                statucode: 400,
                message: "Employee Id required  !!!"
            })
        }

        const updated = await ATTENDACE.findByIdAndUpdate(
            attendanceId,
            {
                $set: {
                    logoutTime: moment().tz('Asia/Kolkata').format('MMMM Do YYYY, h:mm:ss a'),
                    totalSeconds: totalSeconds || 0,
                    totalHours: moment.duration(totalSeconds || 0, 'seconds').humanize(),
                    status: totalHours >= 8 ? 'present'
                        : totalHours >= 4 ? 'half day'
                            : 'holiday'
                }
            },
            { new: true }
        )

        if (!updated) {
            return res.send({
                statucode: 404,
                message: "No Attendance record!!!"
            })
        }

        // Employee inactive mark karo
        await USER.updateOne(
            { employeeId },
            { $set: { isActive: false } }
        )

        return res.send({
            statucode: 200,
            message: "Logout successful !!!",
            // **** ye san electron ke through databaseman update hoga!
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
// ********************
const getAllEmployee = async (req, res) => {
    try {
        const employees = await USER.find().select('-password')
        return res.send({
            statuscode: 200,
            message: "Employees fetched successfully!",
            data: employees
        })
    } catch (error) {
        return res.send({ statuscode: 500, message: "Server error!", error })
    }
}
// ************************
const getEmployee = async (req, res) => {
    try {
        const employee = await USER.findById(req.params.id).select('-password')
        if (!employee) {
            return res.send({ statuscode: 404, message: "Employee not found!" })
        }
        return res.send({ statuscode: 200, data: employee })
    } catch (error) {
        return res.send({ statuscode: 500, message: "Server error!", error })
    }
}
module.exports = { loginEmployee, logoutEmployee, getAllEmployee }