const sql = require("./db");

// constructor
const Admins = function (user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.email_status = user.email_status;
};

Admins.findByEmail = (email) => {
    let queryText = `SELECT * FROM admin WHERE  email = ?`;

    return new Promise((res, rej) => {
        sql.query(queryText, email, (err, data) => {
            if (err) {
                rej(err);
                return;
            }
            res(data);
        });
    });
};
Admins.updateByEmail = (email, updateData) => {
    Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);
    const queryText =
        "Update admin SET " +
        Object.keys(updateData)
            .map((key) => `${key} = ?`)
            .join(", ") +
        " WHERE email= ?";
    const parameters = [...Object.values(updateData), email];

    return new Promise((res, rej) => {
        sql.query(queryText, parameters, (err, data) => {
            if (err) {
                rej(err);
                return;
            }
            res(data);
        });
    });
};

Admins.createOne = (newUser) => {
    var queryText = `INSERT INTO admin SET ?`;
    Object.keys(newUser).forEach((key) => newUser[key] === undefined && delete newUser[key]);
    console.log(newUser);
    return new Promise((res, rej) => {
        sql.query(queryText, newUser, (err, data) => {
            if (err) {
                rej(err);
                return;
            }
            res(data);
        });
    });
};

module.exports = Admins;
