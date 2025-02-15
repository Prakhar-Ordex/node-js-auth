const jwt = require("jsonwebtoken");
const User = require("../models/auth.model");

const authenticate = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.access_token;
        const refreshToken = req.cookies?.refresh_token;

        if (!accessToken && !refreshToken) {
            return res.status(401).json({ message: "Authentication required. No tokens provided." });
        }

        // Verify access token first
        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken, "privateKey");
                const user = await User.findOne({ where: { id: decoded.id } });

                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }

                req.id = user.id;
                return next();
            } catch (error) {
                if (error.name !== "TokenExpiredError") {
                    return res.status(403).json({ message: "Invalid access token" });
                }
            }
        }

        // If access token is expired, try refresh token
        if (refreshToken) {
            try {
                const decodedRefresh = jwt.verify(refreshToken, "privateKey");
                const user = await User.findOne({ where: { id: decodedRefresh.id } });

                if (!user || user.refresh_token !== refreshToken) {
                    return res.status(403).json({ message: "Invalid refresh token" });
                }

                // Generate a new access token
                const newAccessToken = jwt.sign(
                    { id: user.id, username: user.username, email: user.email },
                    "privateKey",
                    { expiresIn: "1h" } // Increased expiry to 1 hour
                );

                // Set new access token cookie
                res.cookie("access_token", newAccessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "None",
                    maxAge: 60 * 60 * 1000, // 1 hour
                });

                req.id = user.id;
                return next();
            } catch (error) {
                return res.status(403).json({ message: "Invalid refresh token", error: error.message });
            }
        }

        return res.status(401).json({ message: "Authentication failed" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error during authentication", error: error.message });
    }
};

module.exports = authenticate;
