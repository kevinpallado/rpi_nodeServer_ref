const db = require('../connection');

function view(event, data) {
    return new Promise((resolve, reject) => {
        console.log("event => " + event);
        switch (event) {
            case "check":
                var sql_search = "SELECT * FROM accounts WHERE email = '" + data.email + "' AND firstName = '" + data.firstName + "'";
                db.sql.query(sql_search, (err, rows, results) => {
                    resolve(rows.length);
                });
                break;
            case "login":
                var sql_login = "SELECT * FROM accounts WHERE firstName = '" + data.firstName + "' AND password = '" + data.password + "'";
                db.sql.query(sql_login, (err, rows, results) => {
                    console.log(rows);
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                })
            case "get-pin":
                console.log(data);

                var sql_pin = "SELECT * FROM accounts WHERE pin= '" + data.pin + "' AND _id = '" + data.accountID + "'";
                db.sql.query(sql_pin, (err, rows, results) => {
                    console.log(rows);
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                })
                break;
            // case "account-setting":
            //     var sql_account_setting = "SELECT * FROM accounts WHERE  _id = '" + data.accountID + "'";
            //     db.sql.query(sql_account_setting, (err, rows, results) => {
            //         console.log(rows);
            //         if (err) {
            //             reject(err);
            //         }
            //         else {
            //             resolve(rows);
            //         }
            //     })
            //     break;
            default:
                break;
        }
    });
}

function add(event, data) {
    return new Promise((resolve, reject) => {
        console.log(data.PIN);
        switch (event) {
            case "add_account":
                console.log("add");
                var sql_add = "INSERT INTO accounts (firstName, lastName, email, contactNumber, password, birthday,pin,question1,question2,answer1,answer2) VALUES ('" + data.firstName + "','" + data.lastName + "','" + data.email + "','" + data.contactNumber + "','" + data.password + "','" + data.birthday + "','" + data.PIN + "','" + data.question1 + "','" + data.question2 + "','" + data.answer1 + "','" + data.answer2 + "')";
                db.sql.query(sql_add, (err, rows, results) => {
                    console.log(rows);
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });
                break;
            default:
                break;
        }
    });
}

module.exports = {
    view: view,
    add: add
}