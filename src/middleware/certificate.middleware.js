const jwt = require('jsonwebtoken'); // Assuming you're using JWT for token management
const User = require("../models/auth.model");
const Certificate = require("../models/certificate.model");

const validateCertificateAccess = async (req, res, next) => {
    const token = req.cookies?.refresh_token; // Extract token from headers
    let isAuth;
    if (!token) {
        isAuth = false;
    }

    try {
        const decoded = jwt.verify(token, "privateKey"); // Verify token
        const user = await User.findByPk(decoded.id); // Get user details

        const certificate = await Certificate.findByPk(req.params.id); // Get certificate details
        if (!certificate || certificate.userId !== user.id) {
            isAuth = false;
        } else {
            isAuth = true;
        }

        req.isAuth = isAuth; // Attach user to request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = validateCertificateAccess;
