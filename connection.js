const mysql = require('mysql');
const conn = require('./database/config/config.json');

var mysqlConnection = mysql.createConnection({
    host: '192.168.10.10',
    user: conn.development.username,
    password: conn.development.password,
    database: conn.development.database,
    multipleStatements: true,
});

mysqlConnection.connect((err)=>{
    if(!err)
    {
        console.log('Connected');
    }
    else
    {
        console.log('Connection failed');
    }
});

module.exports = mysqlConnection;