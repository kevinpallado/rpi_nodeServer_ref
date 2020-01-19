const db = require('../connection');

function view(event, data) {
    return new Promise(function (resolve, reject) {
        var macaddr = data.macAddress;
        var dataResponse = 
        {
            accountid : 0,
            deviceid : 0,
            state : 0,
            application: 0,
            count : 0,
            init_setup: true
        };
        switch (event) {
            case "check":
                /**
                 * If already register return account ID, device ID, device state (on/off/null), device application (W,D,A)
                 */
                if (macaddr != undefined) {
                    var sql_search = "SELECT * FROM registered_devices WHERE macAddress LIKE '" + macaddr + "%'";
                    var sql_add = "INSERT INTO unregistered_devices (macAddress) VALUES ('" + macaddr + "')";
                    var sql_check = "SELECT * FROM unregistered_devices WHERE macAddress LIKE '" + macaddr + "%'";
                    var sql_remove = "DELETE FROM unregistered_devices WHERE macAddress LIKE '" + macaddr + "%'";
                    const reg = new Promise((resolve, reject) => {
                        db.sql.query(sql_search, (err, rows, results) => {
                            if (err) throw error;
                            if (rows.length > 0) {  // if register, just check to unreg devices
                                dataResponse.accountid = rows[0].accountID;
                                dataResponse.deviceid = rows[0]._id;
                                dataResponse.state = rows[0].state;
                                dataResponse.application = rows[0].application;
                                db.sql.query(sql_check, (err, rows, result) => {
                                    if (err) throw error;
                                    if (rows.length == 0) // if mac is not exists means it is already registered
                                    {
                                        dataResponse.init_setup = false;
                                        dataResponse.register = 1;
                                        resolve(dataResponse);
                                    }
                                    else { // else it is just newly registered on the device
                                        db.sql.query(sql_remove, (err, rows, result) => {
                                            if (err) throw error;
                                            console.log("Affected rows => " + rows.affectedRows);
                                            dataResponse.register = rows.affectedRows;
                                            resolve(dataResponse);
                                        });
                                    }
                                });
                            }
                            else {
                                dataResponse.register = 0;
                                console.log(" => " + dataResponse.register);
                                resolve(dataResponse);
                            }
                        })
                    });

                    // const unreg = new Promise((resolve, reject) => {
                    //     db.sql.query(sql_search, (err, rows, results) => {
                    //         if (err) throw error;
                    //         if (rows.length == 0) {
                    //             db.sql.query(sql_check, (err, rows, result) => {
                    //                 if (err) throw error;
                    //                 if (rows.length == 0) {
                    //                     db.sql.query(sql_add, (err, rows, result) => {
                    //                         console.log("Affected rows => " + rows.affectedRows);
                    //                         dataResponse.register = 0;
                    //                         resolve(dataResponse);
                    //                     });
                    //                 }
                    //             });
                    //         }
                    //         else {
                    //             dataResponse.register = 0;
                    //             resolve(dataResponse);
                    //         }
                    //     })
                    // });
                    resolve(Promise.all([reg]));
                }
                break;
            /**
             * Device(MCU) state case will check the table if there are updated in registered devices
             */
            case "device-state":
                var sql_state = "SELECT * FROM registered_devices WHERE accountID = '" + data.accountid + "' AND macAddress LIKE '" + data.macAddress + "%'";
                db.sql.query(sql_state, (err, rows, results) => {
                    if (err) throw error;
                        if(rows.length > 0)
                        {
                            dataResponse.application = rows[0].application;
                            dataResponse.state = rows[0].state;
                            dataResponse.init_setup = false;
                            resolve(dataResponse);
                        }
                });

            /**
             * Shows all unregistered devices will be accessible in local
             */

            case "unregistered-devices":
                var sql_unreg = "SELECT * FROM unregistered_devices";
                var unreg_dlists = [];
                db.sql.query(sql_unreg, (err, rows, results) => {
                    if (err) throw error;
                    if (rows.length > 0) {
                        for(var i=0; i<rows.length; i++)
                        {
                            unreg_dlists.push({ id: rows[i]._id, macAddress: rows[i].macAddress });
                        }
                        resolve(unreg_dlists);
                    }
                });
                break;
            case "view-unregistered-device":
                console.log("Hello unregistered");
                var sql_unregistered = "SELECT * FROM unregistered_devices";
                db.sql.query(sql_unregistered, (err, rows, results) => {
                    if (err) {reject(err);}
                    else {resolve(rows);}});

            case "registered-devices":
                var sql_designation = "SELECT rd._id, rd.application, rd.deviceLists, rd.area, rd.macAddress, rd.state, acc.firstName, acc.lastName FROM registered_devices as rd LEFT JOIN accounts as acc ON rd.accountID = acc._id WHERE acc._id = '" + data.accountid + "'";
                var reg_dlists = [];
                db.sql.query(sql_designation, (err, rows, results) => {
                    if (err) throw error;
                    if (rows.length > 0) {
                        for(var i=0; i<rows.length; i++)
                        {
                            reg_dlists.push({ id: rows[i]._id,
                                              application: rows[i].application,
                                              deviceLists: rows[i].deviceLists,
                                              area: rows[i].area,
                                              macAddress: rows[i].macAddress,
                                              state: rows[i].state,
                                              firstName: rows[i].firstName,
                                              lastName: rows[i].lastName
                                             });
                        }
                        resolve(reg_dlists);
                    }
                });
            default:
                break;
        }
    });

}

function add(event, data) {
    return new Promise((resolve, reject) => {

        switch (event) {
            case "register-devices":
                console.log("control->:adding");
                var sql_register_device = "INSERT INTO registered_devices (application, deviceLists, area, macAddress, state, accountID) VALUES ('" + data.appliances + "','" + data.deviceList + "','" + data.area + "','" + data.macAddress + "','" + 1 + "','" + data.accountID + "')";
                db.sql.query(sql_register_device, (err, rows, results) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(results);
                    }
                });
                break;

            case "view-registered-device":
                console.log(data.type);
                var sql_view = "SELECT *,registered_devices._id as registered_devices_id from accounts,registered_devices " +
                    "where accounts._id = registered_devices.accountID AND accounts._id = '" + data.accountID + "'" +
                    "AND application = '" + data.type + "'";
                console.log(sql_view);
                db.sql.query(sql_view, (err, rows, results) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });
                break;

            case "toogle-device":
                var new_device_status = '';
                data.status == 0 ? new_device_status = 1 : new_device_status = 0;
                var sql_toogle = "UPDATE registered_devices SET status = '" + new_device_status + "'WHERE registered_devices._id = '" + data.registered_device_id + "'";
                db.sql.query(sql_toogle, (err, rows, results) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(results);
                    }
                });
                break;
            case "door-toogle-device":
                var new_device_status = '';
                console.log("Hello");
                data.status == 0 ? new_device_status = 1 : new_device_status = 0;
                var sql_toogle = "UPDATE registered_devices SET status = '" + new_device_status + "'WHERE registered_devices._id = '" + data.registered_device_id + "'";
                db.sql.query(sql_toogle, (err, rows, results) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        if (new_device_status == 1) {
                            //toogle(new_device_status, data);
                            setTimeout(function () {
                                var sql_toogle = "UPDATE registered_devices SET status = '" + 0 + "'WHERE registered_devices._id = '" + data.registered_device_id + "'";
                                db.sql.query(sql_toogle, (err, rows, results) => {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        resolve(results);
                                    }
                                });
                            }, 9000);
                        } else {
                            resolve(results);
                        }
                    }
                });
                break;
            case "modal-appliances":
                var sql_modal_appliances = "SELECT * from registered_devices where _id ='" + data.device_id + "'";
                db.sql.query(sql_modal_appliances, (err, rows, results) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });
            default:
                break;
        }
    });
}

function update(event, data)
{
    return new Promise((resolve, reject) => {
        var dataResponse = 
        {
            macaddr: 0,
            message: "",
            error: null
        };
        switch(event)
        {
            case "device-state":
                var sql_device_update = "UPDATE registered_devices SET state = '" + data.state + "' WHERE macAddress LIKE '" + data.macaddr + "%' AND accountID = '" + data.accountid + "'";
                db.sql.query(sql_device_update, (err, rows, results) => {
                    if (err) throw error;
                    if(rows.affectedRows > 0)
                    {
                        dataResponse.error = false;
                        dataResponse.message = "Successfully update device state on macaddress " + data.macaddr;
                        dataResponse.macaddr = data.macaddr;

                        resolve(dataResponse);
                    }
                    else
                    {
                        dataResponse.error = true;
                        dataResponse.message = "Something went wrong please check your variable request";

                        resolve(dataResponse);
                    }
                });
            break;

            case "device-designation":

            break;
        }
    });
}

module.exports = {
    view: view,
    update: update,
    add: add
}