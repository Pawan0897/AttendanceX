const USER = require("../modal/user_modal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const isEmailexist = await USER.findOne({ email });

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
                email: isEmailexist.email
            }
        })

    } catch (error) {
        return res.send({
            statuscode: 500,
            message: "Server error: " + error.message
        })
    }
}

module.exports = { userLogin };