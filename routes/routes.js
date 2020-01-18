const express = require('express'),
      Router = express.Router(),
      Account = require('../core/account'),
      Consumption = require('../core/consumption');
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
                res.send(JSON.stringify({'result': 'Email is already registered', 'error': true}));
            } else {
                var add_reg = await Account.add("add_account", req.body);
                res.send(JSON.stringify({'result' : 'Successfully registered', 'error': false})); 
            }
            break;
        
        default:
            break;
    }
});

Router.post("/devices/event", async(req, res) => {
    var response;
    switch(req.query.event)
    {
        case "view":
            response = await Device.view(req.query.method, req.body);
            if(req.query.method === "check")
            {
                console.log("CHECK! => " + JSON.stringify(response[0]));
                res.send(JSON.stringify(response[0]));
            }
            else
            {
                res.send(JSON.stringify(response));
            }
            break;
        
        case "update":
            response = await Device.update(req.query.method, req.body);
            !response.error && req.body.state == 1 ? emon_timer = true : emon_timer = false;
            res.send(JSON.stringify(response));

        case "door-toogle-device":
            var toogle = await Device.adding(req.body.event, req.body);
            res.send(JSON.stringify({ 'result': toogle }));
            break;

        case "modal-appliances":
            var modal_appliances = await Device.adding(req.body.event, req.body);
            res.send(modal_appliances);
            break;

        case "view-unregistered-device":
            var unregistered = await Device._view(req.body.event, req.body);
            res.send(unregistered);

        default:
            break;
    }
});

Router.post("/devices/consumption/event", async function(req, res) {
    switch(req.query.event)
    {
        case "add":
            response = await Consumption.add(req.query.method, req.body);
            res.send(JSON.stringify(response));
        default:
            break;
    }
});

module.exports = {
    Router: Router
};