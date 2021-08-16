const sql = require("./db");

const Verify = function (verify) {
    this.id = verify.id;
    this.email = verify.email;
    this.token = verify.token;
};

Verify.createOne = (newVerify) => {
    var query = `INSERT INTO verify ( email, token) VALUES ( "${newVerify.email}", "${newVerify.token}")`;
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

Verify.findByEmail = (email) => {
    let queryText = `SELECT * FROM verify WHERE  email = ?`;

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

Verify.deleteByEmail = (email) => {
    const query = `DELETE FROM verify WHERE email = '${email}'`;
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

Verify.updateUserByEmail = (email) => {
    const query = `UPDATE users SET  email_status = 'verified' WHERE email = '${email}'`;
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

module.exports = Verify;
