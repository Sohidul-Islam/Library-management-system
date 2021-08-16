const bcrypt = require("bcrypt");
const usersModel = require("../models/usersModel");
const authorsModel = require("../models/authorsModel");
const adminsModel = require("../models/adminsModel");

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

exports.checkEmail = async (req, res, next) => {
    try {
        const user = await usersModel.findByEmail(req.body.email);
        const author = await authorsModel.findByEmail(req.body.email);
        const admin = await adminsModel.findByEmail(req.body.email);

        if (user[0] || author[0] || admin[0]) {
            return res.status(201).json({
                checkEmail: "exist",
                message: "Sorry... Email already taken",
            });
        }
        return res.status(201).json({
            checkEmail: "not_exist",
            message: "Email available",
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};
exports.createOne = async (req, res, next) => {
    try {
        const user = await usersModel.findByEmail(req.body.email);
        const author = await authorsModel.findByEmail(req.body.email);
        const admin = await adminsModel.findByEmail(req.body.email);

        if (user[0] || author[0] || admin[0]) {
            return res.status(201).json({
                checkEmail: "exist",
                message: "Sorry... Email already taken",
            });
        }

        const User = new usersModel({
            email: req.body.email,
            password: await hashPassword(req.body.password),
            email_status: "not_verified",
        });

        const newUser = await usersModel.createOne(User);
        if (newUser.affectedRows === 1) {
            next();
        } else {
            return err;
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};
