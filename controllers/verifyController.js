const nodemailer = require("nodemailer");
var randomToken = require("random-token");

const verifyModel = require("../models/verifyModel");
const usersModel = require("../models/usersModel");

async function sendMessage(email, token) {
    var output = `<p>Dear user,</p>
    <p>Thanks for sign up. Your verification email and code is given below :</p>
    <ul>
        <li><strong>Email:<strong> ${email}</li>
        <li><strong>Verify Code:<strong> ${token}</li>
    </ul>
    <p>verify Link: <a href="http://localhost:4000/verify">Verify</a></p>
    <p><strong>This is an automatically generated mail. Please do not reply back.</strong></p>
    <p>Regards,</p>
    <p>Library Management System</p>`;

    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "rakibulislam5130@gmail.com",
            pass: "vpn=(R8)",
        },
    });
    var mailOptions = {
        from: "rakibulisam5130@gmail.com",
        to: email,
        subject: "Email Verification",
        html: output,
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            return console.log(err);
        }
        console.log(info);
    });
}

exports.createOne = async (req, res, next) => {
    try {
        const verify = new verifyModel({
            email: req.body.email,
            token: randomToken(8),
        });
        const newVerify = await verifyModel.createOne(verify);
        sendMessage(verify.email, verify.token);
        if (newVerify.affectedRows === 1) {
            return res.status(201).json({
                check: "success",
                message: "User Account Successfully created",
            });
        }
        next();
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};

exports.verify = async (req, res, next) => {
    try {
        const verifyFields = new verifyModel({
            email: req.body.email,
            token: req.body.token,
        });
        console.log(verifyFields);
        const user = await verifyModel.findByEmail(verifyFields.email);
        console.log(user);
        if (user[0]) {
            if (user[0].token === verifyFields.token) {
                const updateUser = await verifyModel.updateUserByEmail(verifyFields.email);
                const deleteUser = await verifyModel.deleteByEmail(verifyFields.email);
                return res.status(201).json({
                    checkVerify: "verified",
                    type: "success",
                    message: "Successfully verified",
                });
            } else {
                return res.status(404).json({
                    checkVerify: "not_verified",
                    type: "error",
                    message: "Please insert a valid token",
                });
            }
        } else {
            return res.status(404).json({
                type: "error",
                message: "Enter correct email",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            type: "error",
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};
