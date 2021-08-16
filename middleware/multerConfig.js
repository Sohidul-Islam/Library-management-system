const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const dirPath = path.join(__dirname, "..", "public/upload");

const storage = multer.diskStorage({
    // destination:'upload', //When the service starts, the folder will be created automatically
    destination: function (req, file, cb) {
        //The function needs to create a folder manually
        // console.log("destination()", file);
        if (!fs.existsSync(dirPath)) {
            fs.mkdir(dirPath, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    cb(null, dirPath);
                }
            });
        } else {
            cb(null, dirPath);
        }
    },
    filename: function (req, file, cb) {
        var ext = path.extname(file.originalname);
        cb(null, req.body.item_name + "-" + Date.now() + path.extname(file.originalname));
    },
});

exports.upload = multer({ storage: storage });

// Delete picture
exports.deleteSingle = (filename) => {
    fs.unlink(path.join(dirPath, filename), (err) => {
        if (err) {
            console.log(err);
            res.send({
                status: 1,
                msg: "Failed to delete file",
            });
        }
    });
};
