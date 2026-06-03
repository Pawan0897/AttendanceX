

const USER = require("../modal/user_dashboard_modal");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.send({
            status: 400,
            message: "Token is required !!!",
        });
    }
    try {

        const verify_token = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verify_token.userId;
        const user = await USER.findOne({ _id: req.userId });
        req.user = user;
        next();
    } catch (error) {
        return res.status(404).send("invalid token");
    }
};
module.exports = verifyToken;