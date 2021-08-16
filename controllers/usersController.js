const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
var advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(utc);
dayjs.extend(advancedFormat);

const usersModel = require("../models/usersModel");
const authorsModel = require("../models/authorsModel");

exports.getUserPage = async (req, res) => {
    try {
        res.render("users/users", { pageTitle: "Users List" });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};

exports.findAll = async (req, res) => {
    try {
        const users = await usersModel.getAll();

        if (users.length > 0) {
            return res.status(201).json({
                type: "success",
                users,
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};

exports.findOne = async (req, res) => {
    try {
        const item = await itemsModel.findById(req.params.id);
        console.log(item);
        item.published = dayjs(item.published).format("MMMM YYYY");

        res.render("books/book-details", { item });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};

exports.promoteOne = async (req, res) => {
    try {
        const user = await usersModel.findById(req.body.user_id);
        const author = await authorsModel.createOne({ email: user.email });
        console.log("from ", author);

        // if ((deleteUser.affectedRows = 1)) {
        //     return res.status(201).json({
        //         type: "success",
        //         title: "Delete Info",
        //         message: "User successfully deleted",
        //         btnType: "success",
        //         link_text: "OK",
        //         link: req.body.url,
        //     });
        // } else {
        //     return res.status(201).json({
        //         type: "error",
        //         title: "Some problem occurs",
        //         message: "Reload and try again please",
        //         link_text: "OK",
        //         link: req.body.url,
        //     });
        // }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};

exports.deleteOne = async (req, res) => {
    try {
        const deleteUser = await usersModel.deleteById(req.body.user_id);
        if ((deleteUser.affectedRows = 1)) {
            return res.status(201).json({
                type: "success",
                title: "Delete Info",
                message: "User successfully deleted",
                btnType: "success",
                link_text: "OK",
                link: req.body.url,
            });
        } else {
            return res.status(201).json({
                type: "error",
                title: "Some problem occurs",
                message: "Reload and try again please",
                link_text: "OK",
                link: req.body.url,
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};

// dayjs.utc(new Date()).format()
