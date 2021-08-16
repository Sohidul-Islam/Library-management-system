const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
var advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(utc);
dayjs.extend(advancedFormat);

const categoriesModel = require("../models/categoriesModel");

exports.createCategory = async (req, res, next) => {
    try {
        const newCategory = new categoriesModel({
            category_name: req.body.category_name,
        });
        const createNewCategory = await categoriesModel.createCategory(newCategory);
        if (createNewCategory.affectedRows === 1) {
            return res.status(201).json({
                type: "success",
                checkAppointment: "created",
                title: "Successful",
                message: `Appointments Successfully Created`,
                btnType: "success",
                link: req.body.url,
                link_text: "OK",
            });
        } else {
            return err;
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};

exports.getCategoryPage = async (req, res) => {
    try {
        res.render("category/category", { pageTitle: "Category" });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};

exports.findAll = async (req, res) => {
    try {
        const catagories = await categoriesModel.getAll();

        if (catagories.length > 0) {
            return res.status(201).json({
                type: "success",
                catagories,
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};

exports.deleteOne = async (req, res) => {
    try {
        const deleteCategory = await categoriesModel.deleteById(req.body.category_id);
        if ((deleteCategory.affectedRows = 1)) {
            return res.status(201).json({
                type: "success",
                title: "Successfully Deleted",
                message: "Don't forget to reenter if need later!",
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
exports.updateOne = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
    }

    try {
        const updateCategory = new categoriesModel({
            category_id: req.body.category_id,
            category_name: req.body.category_name,
        });
        const categoryUpdate = await categoriesModel.updateById(updateCategory);
        if ((categoryUpdate.affectedRows = 1)) {
            return res.status(201).json({
                type: "success",
                title: "Update Info",
                message: "Data successfully Updated",
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
