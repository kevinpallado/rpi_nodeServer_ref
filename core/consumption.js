const db = require('../connection');

function add(event,data)
{
    return new Promise((resolve, reject) => {
        switch (event) {
            case "insert-consumptions":
                var sql_device_consumptions = "INSERT INTO consumptions (voltage,current,power,dateRecorded,deviceID) VALUES ('" + data.voltage + "','" + data.current + "','" + data.power + "','" + getCurDate() + "','" + data.deviceID + "')";
                console.log(sql_device_consumptions);
                db.sql.query(sql_device_consumptions, (err, rows, results) => {
                    if (err) throw error;
                    resolve(rows.affectedRows);
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
    add : add
}