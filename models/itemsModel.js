const sql = require("./db");

const Items = function (item) {
    this.item_id = item.item_id;
    this.category_id = item.category_id;
    this.item_name = item.item_name;
    this.file_name = item.file_name;
    this.cover = item.cover;
    this.author_name = item.author_name;
    this.isbn = item.isbn;
    this.edition = item.edition;
    this.language = item.language;
    this.pages = item.pages;
    this.type = item.type;
    this.status = item.status;
    this.desc = item.desc;
    this.reader = item.reader;
    this.created_at = item.created_at;
    this.updated_at = item.updated_at;
};

Items.getAll = (fields) => {
    Object.keys(fields).forEach((key) => fields[key] === undefined && delete fields[key]);

    let query = `SELECT  items.item_id, items.item_name, items.file_name, items.cover, items.author_name, items.isbn, items.edition, items.language, items.pages, items.type, items.status, items.desc, items.reader, total_rating, avg_rating, items.category_id, category_name FROM items LEFT JOIN (SELECT item_id, count(*) total_rating, ROUND(AVG(review_star)) avg_rating FROM item_review GROUP BY item_id) item_review ON  item_review.item_id = items.item_id JOIN category ON category.category_id = items.category_id WHERE 1 = 1`;

    if (fields.findBy != "") {
        query = query + ` AND ${fields.findBy} like "%${fields.findData}%" `;
    } else {
        query =
            query +
            ` AND (item_name like "%${fields.findData}%" OR author_name like "%${fields.findData}%" OR isbn like "%${fields.findData}%" OR edition like "%${fields.findData}%" OR language like "%${fields.findData}%") `;
    }
    if (fields.status == "Free") {
        query = query + ` AND status = "Free" `;
    } else if (fields.status == "Paid") {
        query = query + ` AND status != "Free" `;
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
                rej(err);
                return;
            }
            res(data);
        });
    });
};

Items.getTotal = (fields) => {
    let query = ` SELECT COUNT(*) AS total FROM items WHERE 1 = 1`;

    if (fields.findBy != "") {
        query = query + ` AND ${fields.findBy} like "%${fields.findData}%" `;
    } else {
        query =
            query +
            ` AND (item_name like "%${fields.findData}%" OR author_name like "%${fields.findData}%" OR isbn like "%${fields.findData}%" OR edition like "%${fields.findData}%" OR language like "%${fields.findData}%") `;
    }

    if (fields.status && fields.status == "Free") {
        query = query + ` AND status = '${fields.status}'`;
    } else if (fields.status && fields.status == "Paid") {
        query = query + ` AND status != 'Free'`;
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

Items.findById = (itemId) => {
    const query = `SELECT  items.item_id, items.item_name, items.file_name, items.cover, items.author_name, items.isbn, items.edition, items.language, items.pages, items.type, items.status, items.desc, items.reader, total_rating, avg_rating, items.category_id, category_name FROM items LEFT JOIN (SELECT item_id, count(*) total_rating, AVG(review_star) avg_rating FROM item_review WHERE review_status = 'published' GROUP BY item_id) item_review ON  item_review.item_id = items.item_id JOIN category ON category.category_id = items.category_id WHERE items.item_id = ${itemId};`;
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

Items.createOne = (newBook) => {
    Object.keys(newBook).forEach((key) => newBook[key] === undefined && delete newBook[key]);
    var query = `INSERT INTO items SET ?`;

    return new Promise((res, rej) => {
        sql.query(query, newBook, (err, data) => {
            if (err) {
                rej(err);
                return;
            }
            res(data);
        });
    });
};

// Items.deleteById = (id) => {
//     const query = `DELETE FROM appointments WHERE appointment_id = ${id}`;
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

// Items.getRecentAll = () => {
//     const query = `SELECT appointments.schedule_id,
//     appointments.patient_id,
//     appointments.specialization_id,
//     appointments.doctor_id,
//     appointments.problem,
//     appointments.appointment_date,
//     appointments.status,
//     concat(patients.first_name, " ", patients.last_name) as patient_name,
//     concat(doctors.first_name, " ", doctors.last_name) as doctor_name,
//     specializations.specialization_name,
//     schedules.schedule_day,
//     schedules.start_time,
//     schedules.end_time
//     FROM appointments
//     join patients on appointments.patient_id = patients.patient_id
//     join doctors on appointments.doctor_id = doctors.doctor_id
//     join specializations on appointments.specialization_id = specializations.specialization_id
//     join schedules on appointments.schedule_id = schedules.schedule_id  order by appointments.created_at desc limit 10`;
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
// Items.getRecentAllByDoctorId = (id) => {
//     const query = `SELECT appointments.schedule_id,
//     appointments.patient_id,
//     appointments.specialization_id,
//     appointments.doctor_id,
//     appointments.problem,
//     appointments.appointment_date,
//     appointments.status,
//     concat(patients.first_name, " ", patients.last_name) as patient_name,
//     concat(doctors.first_name, " ", doctors.last_name) as doctor_name,
//     specializations.specialization_name,
//     schedules.schedule_day,
//     schedules.start_time,
//     schedules.end_time
//     FROM appointments
//     join patients on appointments.patient_id = patients.patient_id
//     join doctors on appointments.doctor_id = doctors.doctor_id
//     join specializations on appointments.specialization_id = specializations.specialization_id
//     join schedules on appointments.schedule_id = schedules.schedule_id WHERE appointments.doctor_id = ${id} AND  date(appointments.appointment_date) >= date(now()) order by appointments.appointment_date limit 10`;
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
// Items.getRecentAllByPatientId = (id) => {
//     const query = `SELECT appointments.schedule_id,
//     appointments.patient_id,
//     appointments.specialization_id,
//     appointments.doctor_id,
//     appointments.problem,
//     appointments.appointment_date,
//     appointments.status,
//     concat(patients.first_name, " ", patients.last_name) as patient_name,
//     concat(doctors.first_name, " ", doctors.last_name) as doctor_name,
//     specializations.specialization_name,
//     schedules.schedule_day,
//     schedules.start_time,
//     schedules.end_time
//     FROM appointments
//     join patients on appointments.patient_id = patients.patient_id
//     join doctors on appointments.doctor_id = doctors.doctor_id
//     join specializations on appointments.specialization_id = specializations.specialization_id
//     join schedules on appointments.schedule_id = schedules.schedule_id WHERE appointments.patient_id = ${id} AND  date(appointments.appointment_date) >= date(now()) order by appointments.appointment_date limit 10`;
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

// Items.createAppointment = (newAppointment) => {
//     Object.keys(newAppointment).forEach((key) => newAppointment[key] === undefined && delete newAppointment[key]);
//     var query = `INSERT INTO appointments SET ?`;

//     return new Promise((res, rej) => {
//         sql.query(query, newAppointment, (err, data) => {
//             if (err) {
//                 rej(err);
//                 return;
//             }
//             res(data);
//         });
//     });
// };

// Items.getAllDoctorBySpecialization = (specialization_id) => {
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

// Items.createOne = (newVerify) => {
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

// Items.findById = (doctorId) => {
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
// Items.findByEmail = (doctorEmail) => {
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

// Items.updateById = (updateAppointment) => {
//     const query = `UPDATE appointments SET status = "conformed" WHERE appointment_id = ${updateAppointment}`;
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

module.exports = Items;
