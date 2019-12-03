const express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    routes = require('./routes/routes'),
    crypto = require('crypto'),
    static = require('node-static'),
    request = require('request'),
    path = require('path'),
    cron = require('node-cron'),
    file = new static.Server('./'),
    app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const server = http.createServer(app);

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: ' + add);
});
const WebSocket = require('ws');
const s = new WebSocket.Server({ server: server, path: "/echo", noServer: true});
app.use('/automation', routes);
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

s.on('connection', function (ws, req) {

    /******* when server receives messsage from client trigger function with argument message *****/
    ws.on('message', function (message) {
        try {
            console.log("Got json data => " + JSON.parse(message));
            ws.send("Got json data => " + JSON.stringify(message));
        }

        catch(e)
        {
            console.log("Message is not json or empty");
            var data = {
                "registered" : false
            }
            ws.send(JSON.stringify(data));
        }
        ;
         //send to client where message is from
        // s.clients.forEach(function (client) { //broadcast incoming message to all clients (s.clients)
        //     if (client != ws && client.readyState) { //except to the same client (ws) that sent this message
        //         client.send("broadcast: " + message);
        //         console.log("successfully broadcast");
        //         startingChar = false;
        //     }
        //     else
        //     {
        //         console.log(client.readyState + "  " + WebSocket.OPEN);
        //     }
        // });
        
    });
    ws.on('close', function () {
        console.log("lost one client");
    });
    
    console.log("new client connected");
});


cron.schedule('*/10 * * * * *', () => {
    var sock = new WebSocket("ws://192.168.1.14:3000/echo");
    console.log('running a task every minute');
    
    var data = {
        "node" : true,
        "fuck" : "you"
    };
    setTimeout(function () { sock.send(JSON.stringify(data)); }, 1000);

    sock.onmessage = function (event) {
        console.log(event.data);//show received from server data in console of browser
    }
});
server.listen(3000);