
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const USER = require("../models/user_models");

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("req", req.body)
        const isEmailexist = await USER.findOne({ email: email });


        if (!isEmailexist) {
            return res.send({
                statuscode: 400,
                message: "Email is not Exist!"
            })
        }
        const isPasswordValid = await bcrypt.compare(password, isEmailexist.password);
        if (!isPasswordValid) {
            return res.send({
                statuscode: 400,
                message: "Password Not Matched!"
            })
        }

        // ************ access Toekn 
        const accessToken = jwt.sign({ userId: isEmailexist._id, email: isEmailexist.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
        // *********** refresh token 
        const refreshToken = jwt.sign({ userId: isEmailexist._id, email: isEmailexist.email, role: isEmailexist.role }, process.env.JWT_REFRESH_TOK, { expiresIn: "7d" });


        // xxresxxx
        return res.send({
            statuscode: 200,
            message: "Login Successfully !!!",
            token: refreshToken,
            accessToken: accessToken,
            user: {
                id: isEmailexist._id,
                email: isEmailexist.email,
                role: isEmailexist.role
            }
        })

    } catch (error) {
        return res.send({
            statuscode: 500,
            message: "Server error: " + error.message
        })
    }
}

// **********************************
const userRegister = async (req, res) => {

    try {
        const { name, email, password, role, phone } = req.body;
        const image = req?.file?.path;
        console.log(req, "ressssss", image, "imaaaaaaa");

        //>>>>>>>>>>>>>>>>>    Validate required fields
        if (!name || !email || !password || !phone) {
            return res.send({
                statuscode: 400,
                message: "Name, email, password, and phone are required!"
            })
        }
        // ************************
        const emailExist = await USER.findOne({ email: email })
        if (emailExist) {
            return res.send({
                statuscode: 400,
                message: "Email already exists!"
            })
        }

        // ===== Hash Password =====
        const hashedPassword = await bcrypt.hash(password, 10);
        // ===== Create new User =====
        const newUser = new USER({
            name,
            email,
            password: hashedPassword,
            role: "hr",
            phone,
            image

        })

        // ===== Save to Database =====
        await newUser.save();
        return res.send({
            statuscode: 201,
            message: "HR User created successfully!",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role

            }
        })
    }
    catch (err) {
        return res.send({
            statuscode: 500,
            message: "Server error: " + err.message
        })
    }
}
// *****************************
const addEmployee = async (req, res) => {
    const { userId, name, phone, role, desgination, isActive, joiningDate, salary, email, password } = req.body;
    const image = req?.file?.path;
    const Email = email.toLowerCase();
    const isemailExist = await USER.findOne({ email: Email });
    const isEmployeeExist = await USER.findOne({ userId });
    const hashPasssword = await bcrypt.hash(password, 10);
    try {
        if (role === "hr" || role == "admin") {
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
            // ****************
            else {
                const data = new USER({
                    userId,
                    name,
                    phone,
                    image: image,
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
                    message: "Employee Addedd Successflly !!!",
                    data: addEmployee
                })
            }
        }
        // ****************
        else {
            return res.send({
                statucode: 400,
                message: "No Permission  !!!"
            })
        }
        // ****************
    } catch (error) {
        return res.send({
            statucode: 500,
            message: "server error !!!", error
        })
    }
}
module.exports = { userLogin, userRegister, addEmployee }