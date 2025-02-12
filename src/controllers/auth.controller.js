const User = require("../models/auth.model");
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const singUp = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!email || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        };

        const hasPasswords = await bcrypt.hash(password, 10);
        console.log(hasPasswords)

        const user = await User.create({ username, email, password: hasPasswords });

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.log({ ...error }.errors)
        res.status(400).json({ error: error.errors[0].message })

    }
}

const singIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: "You don't have an account" });

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword)
            return res.status(401).json({ message: "Invalid credentials" });

        const jwtData = user.dataValues;

        const access_token = jwt.sign(
            { id: jwtData.id, username: jwtData.username, email: jwtData.email },
            'privateKey',
            { expiresIn: "10s" }
        );
        const refresh_token = jwt.sign(
            { id: jwtData.id, username: jwtData.username, email: jwtData.email },
            'privateKey',
            { expiresIn: "1d" }
        );

        const addToken = { ...user, refresh_token, access_token };

        await User.update(addToken, { where: { email } });

        const accessTokenMaxAge = 10 * 1000;
        const refreshTokenMaxAge = 30 * 60 *  1000;

        res.status(200)
            .cookie('access_token', access_token, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: accessTokenMaxAge,
            })
            .cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: refreshTokenMaxAge,
            })
            .json({
                message: "Login successful",
                access_token,
                refresh_token,
                data: user,
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refresh_token;
        if (!refreshToken) return res.status(410).json({ message: "You are not authenticated" });
        const decodedRefresh = jwt.verify(refreshToken, "privateKey");
        const user = await User.findByPk(decodedRefresh.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ user });
    } catch (error) {
        if (error.name !== "TokenExpiredError") {
            return res.status(410).json({ message: "Invalid access token" });
        }
        console.log(error)
    }
}


const logOut = async (_, res) => {
    res.clearCookie('access_token', { path: '/' })
    res.clearCookie('refresh_token', { path: '/' })
    res.status(202).json({ message: "Logged out successfully" });
};

// const cheakMail = async(req,res) =>{
//     const { email } = req.body;
//     try {
//         const user = await User.findOne({ where: { email } });
//         if (!user) return res.status(404).json({ message: "Email not found" });
//         res.status(200).json({ message: "Email found" });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: error.message });
//     }
// }



module.exports = { singUp, singIn, logOut, getProfile };
