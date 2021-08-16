const sql = require("./db");

// constructor
const Users = function (user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.email_status = user.email_status;
};

Users.getAll = () => {
    let query = `select * from users  where  email not in (select email from authors);`;

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

Users.findByEmail = (email) => {
    let queryText = `SELECT * FROM users WHERE  email = ?`;

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

Users.createOne = (newUser) => {
    var queryText = `INSERT INTO users SET ?`;
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

Users.deleteById = (id) => {
    const query = `DELETE FROM users WHERE user_id = ${id}`;
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
module.exports = Users;
