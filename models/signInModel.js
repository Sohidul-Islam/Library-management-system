const sql = require("./db");

const signIn = function (user) {
    this.id = user.id;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role;
    this.email_status = user.email_status;
    this.profile_status = user.profile_status;
    this.token = user.token;
};

signIn.findByFields = (fields) => {
    const params = [];
    let queryText = `SELECT * FROM ${fields.role} WHERE  1 = 1`;
    Object.keys(fields).forEach((key) => fields[key] === undefined && delete fields[key]);
    if (fields.id) {
        queryText = queryText + " and id = ?";
        params.push(fields.id);
    }
    if (fields.email) {
        queryText = queryText + " and email = ?";
        params.push(fields.email);
    }
    return new Promise((res, rej) => {
        sql.query(queryText, params, (err, data) => {
            if (err) {
                rej(err);
                return;
            }
            res(data);
        });
    });
};

signIn.findByEmail = (email) => {
    const query = `SELECT * FROM users WHERE email = '${email}'`;
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

signIn.createOne = (newUser) => {
    var query = `INSERT INTO users ( email, password , email_status, profile_status, role) VALUES ( "${newUser.email}", "${newUser.password}", "${newUser.email_status}", "${newUser.profile_status}", "${newUser.role}")`;
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

module.exports = signIn;
