var jwt = require('jsonwebtoken');
const User = require('../models/auth.model');


const authenticate = async (req, res, next) => {
    try {

        const accessToken = req.cookies?.access_token;
        const refreshToken = req.cookies?.refresh_token;

        if (accessToken) {
            try {
                jwt.verify(accessToken, "privateKey");

                return next();
            } catch (error) {
                if (error.name !== "TokenExpiredError") {
                    return res.status(410).json({ message: "Invalid access token" });
                }
            }
        }
        if (refreshToken) {
            try {
                const decodedRefresh = jwt.verify(refreshToken, "privateKey");

                const user = await User.findOne({ where: { id: decodedRefresh.id } });
                if (!user || user.refresh_token !== refreshToken) {
                    return res.status(410).json({ message: "Invalid refresh token" });
                }
                console.log(user)

                const newAccessToken = jwt.sign(
                    { id: user.id, username: user.username, email: user.email },
                    "privateKey",
                    { expiresIn: "10s" }
                );
                await User.update(
                    { access_token: newAccessToken },
                    { where: { id: user.id } }
                );

                res.cookie("access_token", newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "Strict",
                    maxAge: 10 * 1000, // 10 seconds
                });
                return next();
            } catch (error) {
                return res.status(410).json({ message: "Invalid refresh token" });
            }
        }

        return res.status(410).json({ message: "Unauthorized. Tokens are missing or invalid." })
    } catch (error) {

        return res.status(410).json({ message: "An error occurred during token verification", error });
    }
};



module.exports = authenticate;  