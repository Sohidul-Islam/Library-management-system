const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
var advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(utc);
dayjs.extend(advancedFormat);

const itemReviewsModel = require("../models/itemReviewsModel");

const limit_ = 5;

exports.getItemReviewPage = async (req, res) => {
    try {
        res.render("pdf/pdfViewer", { pageTitle: "PDF Viewer" });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};

exports.findAll = async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || limit_;
        let sortOrder = req.query.sort_order && req.query.sort_order === "desc" ? "desc" : "asc";
        let orderBy = req.query.orderBy;
        let start;
        let filterBy = req.query.filterBy;
        let filterData = req.query.filterData;
        if (page > 1) {
            start = (page - 1) * limit;
        } else {
            start = 0;
        }

        const reviews = await itemReviewsModel.getAll(
            (fields = {
                start,
                limit,
                sortOrder,
                orderBy,
                filterBy,
                filterData,
            })
        );

        const total = await itemReviewsModel.getTotal(
            (fields = {
                filterBy,
            })
        );

        let numPages = Math.ceil(total.total / limit);
        const totalItem = total.total;

        reviews.forEach(function (review) {
            review.review_date = dayjs(review.review_date).format("dddd, DD MM YYYY hh:mm A");
        });

        if (reviews.length > 0) {
            return res.status(201).json({
                type: "success",
                current: page,
                totalItem,
                perPage: reviews.length,
                numPages,
                previous: page > 1 ? page - 1 : undefined,
                next: page <= numPages - 1 ? page + 1 : undefined,
                reviews,
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
        item.published = dayjs(item.published).format("MMMM YYYY");

        res.render("books/book-details", { item });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};

exports.deleteOne = async (req, res) => {
    try {
        const deleteIterReview = await itemReviewsModel.deleteById(req.body.review_id);
        if ((deleteIterReview.affectedRows = 1)) {
            return res.status(201).json({
                type: "success",
                title: "Delete Info",
                message: "Successfully data deleted!",
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
        const updateReview = new categoriesModel({
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
