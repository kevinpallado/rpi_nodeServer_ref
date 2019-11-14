const db = require('../connection');

function view(event,data)
    {
        switch(event){
            case "check":
                var sql_search = "SELECT * FROM accounts WHERE email = '" + data.email + "' AND firstName = '" + data.firstname + "'";
                db.query(sql_search, (err, rows, results) => {
                    return rows.length;
                });
                break;
            case "login":
                var sql_login = "SELECT * FROM accounts WHERE firstName = '" + data.firstname + "' AND password = '" + data.password + "'";
                db.query(sql_login, (err, rows, results) => {
                    if(err)
                    {
                        throw err;
                    }
                    else
                    {
                        return rows;
                    }
                })
            default:
                break;
        }
    }

function add(event,data)
    {
        switch(event){
            case "add_account":
                var sql_add = "INSERT INTO accounts (firstName, lastName, email, contactNumber, password, birthday) VALUES ('"+ data.firstname + "','" + data.lastname + "','" + data.email + "','" + data.contactnumber + "','" + data.password + "','" + data.birthday + "')";
                db.query(sql_add, (err, rows, results) => {
                    if(!err)
                    {
                        return results;
                    }
                });
                break;
            default:
                break;
        }
    }

module.exports = {
    view : view,
    add  : add
}