const sql = require("./db");

const Categories = function (Category) {
    this.category_id = Category.category_id;
    this.category_name = Category.category_name;
};

Categories.createCategory = (newCategory) => {
    Object.keys(newCategory).forEach((key) => newCategory[key] === undefined && delete newCategory[key]);
    var query = `INSERT INTO category SET ?`;

    return new Promise((res, rej) => {
        sql.query(query, newCategory, (err, data) => {
            if (err) {
                rej(err);
                return;
            }
            res(data);
        });
    });
};

Categories.getAll = () => {
    let query = ` SELECT * FROM category WHERE 1 = 1`;

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

Categories.getTotal = (fields) => {
    let query = ` SELECT COUNT(*) AS total FROM items WHERE 1 = 1`;

    if (fields.sortOrder && fields.orderBy) {
        query = query + ` ORDER BY ${fields.orderBy} ${fields.sortOrder}`;
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

Categories.findById = (itemId) => {
    const query = `SELECT * FROM items WHERE item_id = ${itemId};`;
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

Categories.updateById = (updateCategory) => {
    console.log(updateCategory);
    const query = `UPDATE category SET category_name = "${updateCategory.category_name}" WHERE category_id = ${updateCategory.category_id}`;
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

Categories.deleteById = (id) => {
    const query = `DELETE FROM category WHERE category_id = ${id}`;
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

module.exports = Categories;
