const sql = require("./db");

const ItemReviews = function (review) {
    this.review_id = review.review_id;
    this.user_id = review.user_id;
    this.item_id = review.item_id;
    this.review_star = review.review_star;
    this.review_text = review.review_text;
    this.review_status = review.review_status;
    this.review_date = review.review_date;
};

ItemReviews.publishGetAll = (fields) => {
    Object.keys(fields).forEach((key) => fields[key] === undefined && delete fields[key]);

    let query = `SELECT item_review.review_id, 
    item_review.user_id,  user_name,  users.user_img,
    item_review.item_id, 
    review_date, 
    review_text, review_star
    FROM item_review LEFT JOIN users 
    ON item_review.user_id = users.user_id 
    LEFT JOIN items ON item_review.item_id = items.item_id WHERE   review_status = "published" and item_review.item_id = ${fields.item_id} `;

    if (fields.start >= 0 && fields.limit) {
        query = query + ` limit ${fields.limit} offset ${fields.start}`;
    }

    return new Promise((res, rej) => {
        sql.query(query, (err, data) => {
            if (err) {
                console.log(err);
                rej(err);
                return;
            }
            res(data);
        });
    });
};

ItemReviews.publishGetTotal = (fields) => {
    let query = ` SELECT COUNT(*) AS total FROM item_review where review_status= "published" AND item_id = ${fields.item_id} `;
    return new Promise((res, rej) => {
        sql.query(query, (err, data) => {
            if (err) {
                rej(err);
                return;
            }
            res(data[0]);
        });
    });
};

ItemReviews.getAll = (fields) => {
    Object.keys(fields).forEach((key) => fields[key] === undefined && delete fields[key]);

    let query = `SELECT item_review.review_id, 
    item_review.user_id,  user_name,  users.user_img,
    item_review.item_id, item_name,
    review_date, review_status, 
    review_text, review_star
    FROM item_review LEFT JOIN users 
    ON item_review.user_id = users.user_id 
    LEFT JOIN items ON item_review.item_id = items.item_id WHERE 1 = 1 `;

    if (fields.filterBy == "review_status" && fields.filterData) {
        if (fields.filterData == 1) {
            query = query + ` AND review_status = "published" `;
        } else {
            query = query + ` AND review_status = "not_published" `;
        }
    }

    if (fields.sortOrder && fields.orderBy) {
        query = query + ` ORDER BY ${fields.orderBy} ${fields.sortOrder}`;
    }

    if (fields.start >= 0 && fields.limit) {
        query = query + ` limit ${fields.limit} offset ${fields.start}`;
    }

    return new Promise((res, rej) => {
        sql.query(query, (err, data) => {
            if (err) {
                console.log(err);
                rej(err);
                return;
            }
            res(data);
        });
    });
};

ItemReviews.getTotal = (fields) => {
    let query = ` SELECT COUNT(*) AS total FROM item_review WHERE 1 = 1`;

    if (fields.filterBy == "review_status" && fields.filterData) {
        if (fields.filterData == 1) {
            query = query + ` AND review_status = "published" `;
        } else {
            query = query + ` AND review_status = "not_published" `;
        }
    }

    return new Promise((res, rej) => {
        sql.query(query, (err, data) => {
            if (err) {
                rej(err);
                return;
            }
            res(data[0]);
        });
    });
};

ItemReviews.findById = (fields) => {
    const query = `SELECT * FROM item_review where item_id =  ${fields.item_id} and user_id= ${fields.user_id};`;
    return new Promise((res, rej) => {
        sql.query(query, (err, data) => {
            if (err) {
                rej(err);
                return;
            }
            if (res.length) {
                res(data[0]);
            } else {
                res("not found");
            }
        });
    });
};

ItemReviews.deleteById = (id) => {
    const query = `DELETE FROM item_review WHERE review_id = ${id}`;
    return new Promise((res, rej) => {
        sql.query(query, (err, data) => {
            if (err) {
                rej(err);
                return;
            }
            res(data);
        });
    });
};

ItemReviews.addReview = (newReview) => {
    Object.keys(newReview).forEach((key) => newReview[key] === undefined && delete newReview[key]);
    var query = `INSERT INTO item_review SET ?`;

    return new Promise((res, rej) => {
        sql.query(query, newReview, (err, data) => {
            if (err) {
                rej(err);
                return;
            }
            res(data);
        });
    });
};

ItemReviews.updateById = (updateReview) => {
    const query = `UPDATE item_review SET review_star=${updateReview.review_star}, review_text='${updateReview.review_text}', review_status='not_published', review_date= '${updateReview.review_date}' WHERE review_id = ${updateReview.review_id}`;
    return new Promise((res, rej) => {
        sql.query(query, (err, data) => {
            if (err) {
                rej(err);
                return;
            }
            res(data);
        });
    });
};

ItemReviews.updateStatusById = (updateReview) => {
    const query = `UPDATE item_review SET review_status='${updateReview.review_status}' WHERE review_id = ${updateReview.review_id}`;
    console.log(query);
    return new Promise((res, rej) => {
        sql.query(query, (err, data) => {
            if (err) {
                rej(err);
                return;
            }
            res(data);
        });
    });
};

// ItemReviews.getAllDoctorBySpecialization = (specialization_id) => {
//     const query = `SELECT * FROM doctors WHERE specialization_id = ${specialization_id}`;
//     return new Promise((res, rej) => {
//         sql.query(query, (err, data) => {
//             if (err) {
//                 rej(err);
//                 return;
//             }
//             res(data);
//         });
//     });
// };

// ItemReviews.createOne = (newVerify) => {
//     Object.keys(newVerify).forEach((key) => newVerify[key] === undefined && delete newVerify[key]);
//     var query = `INSERT INTO doctors SET ?`;

//     return new Promise((res, rej) => {
//         sql.query(query, newVerify, (err, data) => {
//             if (err) {
//                 rej(err);
//                 return;
//             }
//             res(data);
//         });
//     });
// };

// ItemReviews.findById = (doctorId) => {
//     const query = `SELECT * FROM doctors JOIN specializations ON doctors.specialization_id = specializations.specialization_id WHERE doctors.doctor_id = ${doctorId};`;
//     return new Promise((res, rej) => {
//         sql.query(query, (err, data) => {
//             if (err) {
//                 rej(err);
//                 return;
//             }
//             if (res.length) {
//                 res(data[0]);
//             } else {
//                 res("not found");
//             }
//         });
//     });
// };
// ItemReviews.findByEmail = (doctorEmail) => {
//     const query = `SELECT * FROM doctors JOIN specializations ON doctors.specialization_id = specializations.specialization_id WHERE doctors.email = '${doctorEmail}';`;
//     return new Promise((res, rej) => {
//         sql.query(query, (err, data) => {
//             if (err) {
//                 rej(err);
//                 return;
//             }
//             res(data);
//         });
//     });
// };

module.exports = ItemReviews;
