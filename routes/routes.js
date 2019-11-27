const express = require('express'),
      Router = express.Router(),
      Account = require('../core/account'),
      Device = require('../core/device');
      

Router.post("/account/event/", function(req, res){
    switch(req.query.event) {
        case "login":
            var login = Account.view(req.query.event, req.body);
            res.send(login);
            break;
            
        case "register":
            var count = Account.view("check", req.body);
            if (count > 0) {
                res.send('Email is already registered');
            } else {
                var add_reg = Account.add("add_account", req.body);
                res.send(add_reg); 
            }
            break;
        
        default:
            break;
    }
});

Router.post("/devices/event/", async(req, res) => {
    var num = await Device._view(req.query.event, req.body);
    res.send({ data: num });
});

module.exports = Router;