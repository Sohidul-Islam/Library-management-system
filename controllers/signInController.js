const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const signInModel = require("../models/signInModel");
const usersModel = require("../models/usersModel");
const authorsModel = require("../models/authorsModel");
const adminsModel = require("../models/adminsModel");

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.signIn = async (req, res) => {
    try {
        const user = await usersModel.findByEmail(req.body.email);
        const author = await authorsModel.findByEmail(req.body.email);
        const admin = await adminsModel.findByEmail(req.body.email);
        if (user.length > 0) {
            if (validatePassword(req.body.password, user[0].password)) {
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        role: "user",
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "2h",
                    }
                );
                const { password, ...userWithoutPassword } = user[0];
                userWithoutPassword.role = "user";
                userWithoutPassword.token = token;
                if (user[0].email_status == "not_verified") {
                    return res.status(201).json({
                        type: "Warning",
                        checkPassword: "not_verified",
                        title: "Verify Info",
                        message: "Please verify your email",
                        btnType: "warning",
                        link: `/verify`,
                        link_text: "Verify",
                    });
                } else {
                    return res.status(201).json({
                        type: "success",
                        title: "Successful Sign In",
                        message: "Welcome user!",
                        btnType: "success",
                        link: `/books`,
                        link_text: "Go to dashboard",
                        userData: userWithoutPassword,
                    });
                }
            }
        } else if (author.length > 0) {
            if (validatePassword(req.body.password, author[0].password)) {
                const token = jwt.sign(
                    {
                        email: author[0].email,
                        role: "author",
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "2h",
                    }
                );
                if (author[0].email_status == "not_verified") {
                    return res.status(201).json({
                        type: "Warning",
                        checkPassword: "not_verified",
                        title: "Verify Info",
                        message: "Please verify your email",
                        btnType: "warning",
                        link: `/verify`,
                        link_text: "Verify",
                    });
                } else {
                    const { password, ...authorWithoutPassword } = author[0];
                    authorWithoutPassword.role = "author";
                    authorWithoutPassword.token = token;
                    return res.status(201).json({
                        type: "success",
                        title: "Successful Sign In",
                        message: "Welcome user!",
                        btnType: "success",
                        link: `/books`,
                        link_text: "Go to dashboard",
                        userData: authorWithoutPassword,
                    });
                }
            }
        } else if (admin.length > 0) {
            if (validatePassword(req.body.password, admin[0].password)) {
                const token = jwt.sign(
                    {
                        email: admin[0].email,
                        role: "admin",
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "2h",
                    }
                );
                if (admin[0].email_status == "not_verified") {
                    return res.status(201).json({
                        type: "Warning",
                        checkPassword: "not_verified",
                        title: "Verify Info",
                        message: "Please verify your email",
                        btnType: "warning",
                        link: `/verify`,
                        link_text: "Verify",
                    });
                } else {
                    const { password, ...adminWithoutPassword } = admin[0];
                    adminWithoutPassword.role = "admin";
                    adminWithoutPassword.token = token;
                    return res.status(201).json({
                        type: "success",
                        title: "Successful Sign In",
                        message: "Welcome admin!",
                        btnType: "success",
                        link: `/books`,
                        link_text: "Go to dashboard",
                        userData: adminWithoutPassword,
                    });
                }
            }
        } else {
            return res.status(422).json({
                type: "info",
                checkEmail: "no_user",
                message: "No user found at this email",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};

exports.checkUser = async (req, res, next) => {
    try {
        const user = await usersModel.findByFields(
            (fields = {
                email: req.body.email,
            })
        );
        if (user) {
            if (user[0].email_status == "not_verified") {
                return res.status(201).json({
                    checkEmail: "not_verified",
                    message: "Please verify your email",
                    link: "/api/v1/auth/verify",
                });
            } else {
                return res.status(201).json({
                    checkEmail: "not_updated",
                    message: "Please update your profile",
                    link: "/api/v1/auth/profile",
                });
                next();
            }
        } else {
            return res.status(422).json({
                checkEmail: "no_user",
                message: "No user found at this email",
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};

exports.createOne = async (req, res, next) => {
    try {
        const user = await signUpModel.findByEmail(req.body.email);
        if (user) {
            if (user.email_status == "not_verified") {
                return res.status(201).json({
                    message: "Please verify your email",
                    link: "/api/v1/auth/verify",
                });
            } else {
                return res.status(201).json({
                    message: "The E-mail already in use",
                });
            }
        }
        const signup = new signUpModel({
            email: req.body.email,
            password: await hashPassword(req.body.password),
            email_status: "not_verified",
            profile_status: "not_updated",
            role: req.body.role,
        });
        const newUser = await signUpModel.createOne(signup);
        if (newUser.affectedRows === 1) {
            next();
        } else {
            return err;
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};
