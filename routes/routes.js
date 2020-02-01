const express = require('express'),
    Router = express.Router(),
    Account = require('../core/account'),
    Consumption = require('../core/consumption');
Device = require('../core/device');

Router.post("/account/event/", async (req, res) => {
    switch (req.body.event) {
        case "login":
            var login = await Account.view(req.body.event, req.body);
            res.send(login);
            break;

        case "register":
            var count = await Account.view("check", req.body);
            if (count > 0) {
                res.send(JSON.stringify({ 'result': 'Email is already registered', 'error': true }));
            } else {
                var add_reg = await Account.add("add_account", req.body);
                res.send(JSON.stringify({ 'result': 'Successfully registered', 'error': false }));
            }
            break;
        case "get-pin":
            var pin = await Account.view(req.body.event, req.body);
            res.send(pin);
        default:
            break;
    }
});

Router.post("/devices/event", async (req, res) => {
    var response;
    switch (req.query.event) {
        case "view":
            response = await Device.view(req.query.method, req.body);
            if (req.query.method === "check") {
                //console.log("CHECK! => " + JSON.stringify(response[0]));
                res.send(JSON.stringify(response[0]));
            }
            else {
                res.send(JSON.stringify(response));
            }
            break;

        case "update":
            response = await Device.update(req.query.method, req.body);
            !response.error && req.body.state == 1 ? emon_timer = true : emon_timer = false;
            res.send(JSON.stringify(response));
            break;

        case "view-registered-device":
            var view_register_device = await Device.add(req.body.event, req.body);
            res.send(view_register_device);
            break;

        case "toogle-device":
            console.log("Hi");
            var toogle = await Device.add(req.body.event, req.body);
            res.send(JSON.stringify({ 'result': toogle }));
            break;

        case "door-toogle-device":
            var toogle = await Device.add(req.body.event, req.body);
            res.send(JSON.stringify({ 'result': toogle }));
            break;

        case "modal-appliances":
            var modal_appliances = await Device.add(req.body.event, req.body);
            res.send(modal_appliances);
            break;

        case "view-unregistered-device":
            var unregistered = await Device.view(req.body.event, req.body);
            res.send(unregistered);
            break;
        case "register-devices":
            var registered = await Device.add(req.body.event, req.body);
            res.send(registered);
            break;
        default:
            break;
    }
});

Router.post("/devices/consumption/event", async function (req, res) {
    console.log(req.query.event);
    switch (req.query.event) {
        case "insert-consumptions":
            console.log("hello Router");
            response = await Consumption.add(req.query.event, req.body);
            res.send(JSON.stringify(response));
            break;
        case "view-consumptions":
            response = await Consumption.add(req.query.event, req.body);
            res.send(JSON.stringify(response));
        default:
            break;
    }
});

module.exports = {
    Router: Router
};