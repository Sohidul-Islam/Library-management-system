const dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
var advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(utc);
dayjs.extend(advancedFormat);

const itemsModel = require("../models/itemsModel");
const limit_ = 12;

exports.getBookPage = async (req, res) => {
    try {
        res.render("books/books", { pageTitle: "Book List" });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};
exports.getAddBookPage = async (req, res) => {
    try {
        res.render("books/addBook", { pageTitle: "Add New Book" });
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
        let sortOrder = req.query.sortOrder && req.query.sortOrder === "desc" ? "desc" : "asc";
        let status = req.query.status;
        let orderBy = req.query.orderBy;
        let start;
        let findBy = req.query.findBy;
        let findData = req.query.findData;
        if (page > 1) {
            start = (page - 1) * limit;
        } else {
            start = 0;
        }

        const items = await itemsModel.getAll(
            (fields = {
                start,
                limit,
                status,
                findBy,
                findData,
                orderBy,
                sortOrder,
            })
        );

        const total = await itemsModel.getTotal(
            (fields = {
                status,
                findBy,
                findData,
            })
        );

        let numPages = Math.ceil(total.total / limit);
        const totalItem = total.total;

        if (items.length > 0) {
            return res.status(201).json({
                type: "success",
                current: page,
                totalItem,
                perPage: limit,
                numPages,
                start,
                previous: page > 1 ? page - 1 : undefined,
                next: page <= numPages - 1 ? page + 1 : undefined,
                items,
            });
        } else {
            return res.status(201).json({
                type: "warning",
                message: "Sorry, No book found",
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};
exports.addNewBook = async (req, res) => {
    try {
        const newBook = new itemsModel({
            category_id: req.body.category_id,
            item_name: req.body.item_name,
            file_name: req.files.file[0].filename,
            cover: req.files.img[0].filename,
            author_name: req.body.author_name,
            isbn: req.body.isbn,
            edition: req.body.edition,
            language: req.body.language,
            pages: req.body.pages,
            type: req.body.type,
            status: req.body.status,
            desc: req.body.desc,
            reader: 0,
            created_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            updated_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        });
        const createNewBook = await itemsModel.createOne(newBook);
        if (createNewBook.affectedRows === 1) {
            return res.status(201).json({
                type: "success",
                title: "Book Created",
                message: `Book Successfully inserted`,
                link: "/books/add-book",
                link_text: "OK",
                btnType: "success",
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
        res.render("books/book-details", { pageTitle: "Book Details", item });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
        });
    }
};
