const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
var advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(utc);
dayjs.extend(advancedFormat);

const itemReviewsModel = require("../models/itemReviewsModel");

const limit_ = 10;

exports.addReview = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
    }
    const createReview = new itemReviewsModel({
        item_id: req.body.item_id,
        user_id: req.body.user_id,
        review_text: req.body.review_text,
        review_star: req.body.review_star,
        review_status: "not_published",
        review_date: dayjs.utc(new Date()).format(),
    });

    const review = await itemReviewsModel.addReview(createReview);
    if (review.affectedRows == 1) {
        return res.status(201).json({
            type: "success",
            title: "Review created",
            message: "Thanks for your feedback",
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
};

exports.getItemReviewPage = async (req, res) => {
    try {
        res.render("itemReviews/itemReviews", { pageTitle: "Item Reviews" });
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

exports.findUserOne = async (req, res) => {
    try {
        const review = await itemReviewsModel.findById({
            user_id: req.body.user_id,
            item_id: req.body.item_id,
        });
        if (review) {
            review.review_date = dayjs(review.review_date).format("dddd, DD MM YYYY hh:mm A");
            return res.status(201).json({
                type: "success",
                review,
            });
        }
        return res.status(201).json({
            type: "failed",
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};

exports.deleteOne = async (req, res) => {
    try {
        console.log(req.body);
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
        const updateReview = new itemReviewsModel({
            review_id: req.body.review_id,
            review_star: req.body.edit_review_star,
            review_text: req.body.updateReview_text,
            review_date: dayjs.utc(new Date()).format(),
        });
        const updateR = await itemReviewsModel.updateById(updateReview);
        if ((updateR.affectedRows = 1)) {
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

exports.updateStatusOne = async (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
    }

    try {
        const updateReview = new itemReviewsModel({
            review_id: req.body.review_id,
            review_status: req.body.review_status,
        });
        const updateR = await itemReviewsModel.updateStatusById(updateReview);
        if ((updateR.affectedRows = 1)) {
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

exports.publishFindAll = async (req, res) => {
    try {
        let page = parseInt(req.body.page) || 1;
        let limit = parseInt(req.body.limit) || limit_;
        let start;
        let item_id = req.body.item_id;
        if (page > 1) {
            start = (page - 1) * limit;
        } else {
            start = 0;
        }
        const reviews = await itemReviewsModel.publishGetAll(
            (fields = {
                start,
                limit,
                item_id,
            })
        );
        const total = await itemReviewsModel.publishGetTotal(
            (fields = {
                item_id,
            })
        );
        let numPages = Math.ceil(total.total / limit);
        const totalItem = total.total;
        reviews.forEach(function (review) {
            review.review_date = dayjs(review.review_date).format("dddd, DD MMMM YYYY hh:mm A");
        });

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
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};
