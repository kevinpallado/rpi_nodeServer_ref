const express = require('express'),
      Router = express.Router(),
      Account = require('../core/account'),
      Device = require('../core/device');
      

Router.post("/account/event/", async (req, res) => {
    switch(req.query.event) {
        case "login":
            var login = await Account.view(req.query.event, req.body);
            res.send(login);
            break;
            
        case "register":
            var count = await Account.view("check", req.body);
            if (count > 0) {
                res.send('Email is already registered');
            } else {
                var add_reg = await Account.add("add_account", req.body);
                res.send(add_reg); 
            }
            break;
        
        default:
            break;
    }
});

Router.post("/devices/event/", async(req, res) => {
    var _response = [];
    var num = await Device._view(req.query.event, req.body);
    Object.values(num).forEach(val => {
        _response.push(val);
    });
    console.log(JSON.stringify({ reg: _response[0], unreg: _response[1] }));
    res.send(JSON.stringify({ reg: _response[0], unreg: _response[1] }));
});

module.exports = Router;