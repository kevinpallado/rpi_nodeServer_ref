const express = require('express');
const Router = express.Router();
const dbcon = require('../connection.js');

function index(){
    
}


Router.get("/", (req, res) => {
    
    dbcon.query("SELECT * FROM accounts", (err, rows, fields) => {
        if(!err)
        {
            res.send(rows);
        }
    });
    
});

module.exports = Router;