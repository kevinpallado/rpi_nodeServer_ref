const db = require('../connection');

function add(event, data) {
    return new Promise((resolve, reject) => {
        console.log(event);
        console.log("hello core");
        switch (event) {
            case "insert-consumptions":
                var sql_device_consumptions = "INSERT INTO consumptions (voltage,current,power,deviceID,account_id) VALUES ('" + data.voltage + "','" + data.current + "','" + data.power + "','" + data.deviceID + "','" + data.accountID + "')";
                db.sql.query(sql_device_consumptions, (err, rows, results) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        var sql_view = "SELECT * from consumptions where  account_id ='" + data.accountID + "' order by dateRecorded desc ";
                        db.sql.query(sql_view, (err, rows, results) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(rows);
                            }
                        });
                        //resolve(results);
                    }
                });
                break;
            case "view-consumptions":
                var sql_view = "SELECT * from consumptions where  account_id ='" + data.accountID + "' order by dateRecorded desc  ";
                db.sql.query(sql_view, (err, rows, results) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });
                break;
        }
    });
}

function getCurDate() {
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
}
module.exports = {
    add: add,
    getCurDate: getCurDate
}