var jwt = require('jsonwebtoken');
const User = require('../models/auth.model');


const authenticate = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.access_token;
        const refreshToken = req.cookies?.refresh_token;

        // If no tokens are present
        if (!accessToken && !refreshToken) {
            return res.status(410).json({ 
                message: "Authentication required. No tokens provided." 
            });
        }

        // Try access token first
        if (accessToken) {
            try {
                const decodedAccess = jwt.verify(accessToken, "privateKey");
                const user = await User.findOne({ where: { id: decodedAccess.id } });
                
                if (!user) {
                    return res.status(410).json({ message: "User not found" });
                }
                
                req.id = await user.dataValues.id; // Store  user id 
                return next();
            } catch (error) {
                // Only proceed to refresh token if access token is expired
                if (error.name !== "TokenExpiredError") {
                    return res.status(410).json({ message: "Invalid access token" });
                }
            }
        }

        // Try refresh token if access token is expired or missing
        if (refreshToken) {
            try {
                const decodedRefresh = jwt.verify(refreshToken, "privateKey");
                const user = await User.findOne({ where: { id: decodedRefresh.id } });

                if (!user || user.refresh_token !== refreshToken) {
                    return res.status(410).json({ message: "Invalid refresh token" });
                }

                // Generate new access token
                const newAccessToken = jwt.sign(
                    { 
                        id: user.id, 
                        username: user.username, 
                        email: user.email 
                    },
                    "privateKey",
                    { expiresIn:"10s" }
                );

                // Update access token in database
                await User.update(
                    { access_token: newAccessToken },
                    { where: { id: user.id } }
                );

                // Set new cookies
                res.cookie("access_token", newAccessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "Strict",
                    maxAge: 10 * 1000, // 15 minutes
                });

                res.cookie("refresh_token", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "Strict",
                    maxAge: 30 * 60 * 1000, // 7 days
                });

                req.id = await user.dataValues.id;
                return next();
            } catch (error) {
                return res.status(410).json({ 
                    message: "Invalid refresh token",
                    error:  error.message
                });
            }
        }

        return res.status(410).json({ message: "Authentication failed" });
    } catch (error) {
        return res.status(500).json({ 
            message: "Internal server error during authentication",
            error: error.message
        });
    }
};



module.exports = authenticate;  