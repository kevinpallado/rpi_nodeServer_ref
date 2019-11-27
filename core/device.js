const db = require('../connection');

function _view(event,data)
    {
        return new Promise(function(resolve,reject) {
            console.log(event + " " +data.macAddress+ " ");
            var macaddr = data.macAddress;
            switch(event){
                case "check":
                    var sql_search = "SELECT * FROM registered_devices WHERE macAddress = '" + data.macAddress + "'";
                    db.query(sql_search, (err, rows, results) => {
                        // console.log(rows.length)
                        resolve(rows.length);
                    });
                case "add-unregister-devices":
                    var sql_add = "INSERT INTO unregistered_devices (macAddress) VALUES ('" + macaddr + "')";
                    var sql_check = "SELECT * FROM unregistered_devices WHERE macAddress = '" + macaddr + "'";
                    db.query(sql_check, (err, rows, result) => {
                        if (rows.length == 0)
                        {
                            db.query(sql_add, (err, rows, result) => {
                                // console.log("results => " + rows[0].macAddress);
                                console.log(rows);
                                resolve(rows.length);
                            });
                        }
                        else
                        {
                            console.log(rows[0].macAddress);
                            resolve(rows.length)
                        }
                    });
                case "register-devices":
                    var sql_retreive = "SELECT * FROM unregistered_devices WHERE macAddress = '" + macaddr + "'";
                    var sql_remove = "DELETE FROM unregistered_devices WHERE macAddress = '" + macaddr + "'";
                    db.query(sql_retreive, (err, rows, result) => {
                        if (rows.length > 1)
                        {
                            db.query(sql_remove, (err, rows, result) => {
                                resolve(rows.length);
                            });
                        }
                    });

                    break;
                default:
                    break;
            }
        });
        
    }

    module.exports = {
        _view : _view
    }