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
        // try {
        //     console.log("Got json data => " + JSON.parse(message));
        //     ws.send("Got json data => " + JSON.stringify(message));
        // }

        // catch(e)
        // {
        //     console.log("Message is not json or empty");
        //     var data = {
        //         "registered" : false
        //     }
        //     ws.send(JSON.stringify(data));
        // };
         //send to client where message is from
        // var clients_conn = 0;
        // var clients = new Promise((resolve, reject) => {
            s.clients.forEach(function (client) { //broadcast incoming message to all clients (s.clients)
                // console.log("client => " + client.readyState + " clients con => "+ clients_conn++);
                // console.log(client !== ws + " " + client.readyState === WebSocket.OPEN);
                if (client != ws && client.readyState == 1) { //except to the same client (ws) that sent this message
                    console.log("Client ready");
                    // console.log(JSON.stringify(client));
                    client.send(JSON.stringify(message));
                    console.log("successfully broadcast");
                    // startingChar = false;
                }
            });
        // });
    });
    ws.on('close', function () {
        console.log("lost one client");
    });
    
    console.log("new client connected");
});
var sock = new WebSocket("ws://192.168.1.12:3000/echo");
cron.schedule('*/10 * * * * *', () => {
    
    console.log('running a task every minute');
    
    // var data = {
    //     "node" : true,
    //     "fuck" : "you"
    // };
    var currentdate = new Date(); 
                var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                var data = {
                    "time" : datetime,
                    "reading" : Math.random()
                };
    sock.send(JSON.stringify(data));
    // sock.onmessage = function (event) {
    //     console.log(event.data);//show received from server data in console of browser
    // }
});
server.listen(3000);