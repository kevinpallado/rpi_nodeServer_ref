const db = require('../connection');

function _view(event,data)
    {
        return new Promise(function(resolve,reject) {
            var macaddr = data.macAddress;
            switch(event){
                case "check":
                    /**
                     * If already register return account ID, device ID, device state (on/off/null), device application (W,D,A)
                     */
                    var sql_search = "SELECT * FROM registered_devices WHERE macAddress = '" + data.macAddress + "'";
                    var sql_add = "INSERT INTO unregistered_devices (macAddress) VALUES ('" + macaddr + "')";
                    var sql_check = "SELECT * FROM unregistered_devices WHERE macAddress = '" + macaddr + "'";
                    const _check = new Promise((resolve, reject) => {
                        db.query(sql_search, (err, rows, results) => {
                            console.log("Register device => " + rows.length);
                            resolve(rows.length);
                        });
                    });
                    const _unreg = new Promise((resolve, reject) => {
                        db.query(sql_check, (err, rows, result) => {
                            if (rows.length == 0)
                            {
                                db.query(sql_add, (err, rows, result) => {
                                    // console.log("results => " + rows[0].macAddress);
                                    console.log("Affected rows => " + rows.affectedRows);
                                    resolve(rows.affectedRows);
                                });
                            }
                            else
                            {
                                console.log(rows[0].macAddress);
                                resolve(rows.length);
                            }
                        });
                    });
                    resolve(Promise.all([_check, _unreg]));
                    break;
                case "unregistered-devices":
                        var sql_unreg = "SELECT * FROM unregistered_devices";
                        db.query(sql_unreg, (err, rows, results) => {
                            if(results.length > 0)
                            {
                                console.log(rows[0].macAddress);
                                console.log(results.length);
                                console.log(JSON.stringify(rows));
                                resolve(results.length);
                            }
                        });
                    break;
                // case "device-state":
                //     var sql_state = "SELECT * FROM registered_devices LEFT JOIN accounts ON registered_devices.accoundID = accounts._id AND registered_devices.accountID = '" + data.accountID;
                //     db.query(sql_state, (err, rows, results) => {
                //         if(err == null)
                //         {
                //             if(rows.length > 0)
                //             {
                //                 resolve(rows);
                //             }
                //         }
                //     });
                case "device-status":
                    var sql_designation = "SELECT * FROM registered_devices LEFT JOIN accounts ON registered_devices.accoundID = accounts._id AND registered_devices.accountID = '" + data.accountID + "' AND registered_devices.macAddress = '" + data.macAddress;
                    db.query(sql_designation, (err, rows, results) => {
                        if(err == null)
                        {
                            if(rows.length > 0)
                            {
                                resolve(rows);
                            }
                        }
                    });
                default:
                    break;
            }
        });
        
    }

function add(event,data)
{
    var macaddr = data.macAddress;
    return new Promise((resolve, reject) => {
        switch(event){
            /**
             * Mac address must exists first before adding to registered device
             */
            case "register-devices":
                var sql_retreive = "SELECT * FROM unregistered_devices WHERE macAddress = '" + macaddr + "'";
                var sql_remove = "DELETE FROM unregistered_devices WHERE macAddress = '" + macaddr + "'";
                var sql_add = "INSERT INTO registered_devices (application, deviceLists, area, macAddress, state, accountID) VALUES ('" + data.application + "','" + data.devicelists + "','" + data.area + "','" + data.macAddress + "','" + data.state + "','" + data.accountid + "')";
                db.query(sql_retreive, (err, rows, result) => {
                    if (rows.length > 1)
                    {
                        db.query(sql_remove, (err, rows, result) => {
                            if(rows.affectedRows > 0)
                            {
                                db.query(sql_add, (err, rows, result) => {
                                    resolve(rows.affectedRows);
                                });
                            }
                            else
                            {
                                resolve(rows.affectedRows);
                            }
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