const USER = require("../modal/user_dashboard_modal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const isEmailexist = await USER.findOne({ email: email });

        if (!isEmailexist) {
            return res.send({
                statuscode: 400,
                message: "Email is not valid!!"
            })
        }


        const isPasswordValid = await bcrypt.compare(password, isEmailexist.password);

        if (!isPasswordValid) {
            return res.send({
                statuscode: 400,
                message: "Password is not valid!!"
            })
        }


        const token = jwt.sign({ userId: isEmailexist._id, email: isEmailexist.email }, process.env.JWT_SECRET, { expiresIn: "7d" }
        );
        // **token addded 
        await USER.updateOne({ email }, {
            $set: {
                token: token
            }
        }, {
            new: true
        })

        return res.send({
            statuscode: 200,
            message: "Login Successfully !!!",
            token: token,
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
const adminRouter = async (req, res) => {
    console.log("login::::::::");

    try {
        const { name, email, password, role, phone } = req.body;


        // Validate required fields
        if (!name || !email || !password || !phone) {
            return res.send({
                statuscode: 400,
                message: "Name, email, password, and phone are required!"
            })
        }

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
            phone

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

module.exports = { userLogin, adminRouter }