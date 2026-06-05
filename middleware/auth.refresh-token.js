const refreshTokenController = async (req, res) => {
    try {
        const refreshToken = req.cookies.RefreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token not found!" });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOK);
        // ***************************
        const newAccessToken = jwt.sign(
            { userId: decoded.userId, email: decoded.email },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
        // ***************************
        res.cookie("AccessToken", newAccessToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });
        // ***************************
        return res.status(200).json({ message: "Token refreshed!" });

    } catch (error) {
        res.clearCookie("AccessToken");
        res.clearCookie("RefreshToken");
        return res.status(401).json({ message: "Session expired, please login again." });
    }
};
module.exports = { refreshTokenController }