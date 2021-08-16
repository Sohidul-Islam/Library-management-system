const sql = require("./db");

// constructor
const Authors = function (user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.email_status = user.email_status;
    this.user_img = user.user_img;
    this.author_bio = user.author_bio;
};

Authors.getAll = () => {
    let query = `select author_id,user_name, authors.email, authors.author_bio from users JOIN authors on users.email = authors.email`;

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

Authors.findByEmail = (email) => {
    let queryText = `SELECT * FROM authors WHERE  email = ?`;

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

Authors.createOne = (newUser) => {
    var queryText = `INSERT INTO authors SET ?`;
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

Authors.deleteById = (id) => {
    const query = `DELETE FROM authors WHERE user_id = ${id}`;
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
module.exports = Authors;
