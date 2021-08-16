const bcrypt = require("bcrypt");
const usersModel = require("../models/usersModel");
const adminsModel = require("../models/adminsModel");

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.createOne = async (req, res, next) => {
    try {
        const admin = await adminsModel.findByEmail(req.body.email);
        if (admin.length > 0) {
            const userData = {
                email: admin[0].email,
                password: admin[0].password,
            };
            if (await validatePassword(req.body.oldPassword, userData.password)) {
                const User = new adminsModel({
                    email: req.body.email,
                    password: await hashPassword(req.body.password),
                });
                const updateUser = await adminsModel.updateByEmail(
                    User.email,
                    (updateData = {
                        password: User.password,
                    })
                );

                if (updateUser.changedRows > 0) {
                    return res.status(201).json({
                        type: "success",
                        checkPassword: "updated",
                        title: "Password Changed",
                        message: "Password successfully changed. Pleas sign in again with new password",
                        link: `/sign-in`,
                        link_text: "Sign In",
                        userData,
                    });
                }
            } else {
                return res.status(201).json({
                    type: "error",
                    checkPassword: "incorrect_password",
                    title: "Incorrect Password",
                    message: "Please Enter write password Or click forget password to get verify token",
                    link: `/auth/reset-password`,
                    link_text: "Forget Password",
                    userData,
                });
            }
        }
        if (user.length > 0) {
            const userData = {
                email: admin[0].email,
                password: admin[0].password,
                user: admin,
            };
            if (await validatePassword(req.body.oldPassword, userData.password)) {
                const User = new usersModel({
                    email: req.body.email,
                    password: await hashPassword(req.body.password),
                });
                const updateUser = await usersModel.updateByEmail(
                    User.email,
                    (updateData = {
                        password: User.password,
                    })
                );

                if (updateUser.changedRows > 0) {
                    return res.status(201).json({
                        type: "success",
                        checkPassword: "updated",
                        title: "Password Changed",
                        message: "Password successfully changed. Pleas sign in again with new password",
                        link: `/sign-in`,
                        link_text: "Sign In",
                        userData,
                    });
                }
            } else {
                return res.status(201).json({
                    type: "error",
                    checkPassword: "incorrect_password",
                    title: "Incorrect Password",
                    message: "Please Enter write password Or click forget password to get verify token",
                    link: `/auth/reset-password`,
                    link_text: "Forget Password",
                    userData,
                });
            }
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};
