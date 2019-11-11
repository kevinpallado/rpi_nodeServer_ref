const express = require('express');
const Router = express.Router();
const mysqlConnection = require('../connection');

Router.get("/", (req, res) => {
    mysqlConnection.query("SELECT * FROM people", (err, rows, fields)=>{
        if(!err)
        {
            
        }
    });
});

module.exports = Router;