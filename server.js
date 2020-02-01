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
let https = require('http').Server(app);
let io = require('socket.io')(https);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, x-xsrf-token, x_csrftoken');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const server = http.createServer(app);

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: ' + add);
});
const WebSocket = require('ws');
const s = new WebSocket.Server({ server: server, path: "/echo", noServer: true });

app.use('/automation', routes.Router);
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


io.sockets.on('connection', function (socket) {


    sendData(socket); // Excisting Socket

})


let voltage = 0;
let current = 5;
let power = 3;
function sendData(socket) {
    socket.emit('data1', {
        voltage: voltage,
        current: current,
        power: power,
        _id: 25,
        created: new Date(),
    });
    console.log('tr');
    setTimeout(() => {
        sendData(socket);
        voltage++;
        current++;
        power++;
    }, 2000);
}
// s.on('connection', function (ws, req) {

//     ws.on('message', function (message) {

//         s.clients.forEach(function (client) { //broadcast incoming message to all clients (s.clients)1
//             if (client != ws && client.readyState == 1) { //except to the same client (ws) that sent this message
//                 client.send(JSON.stringify(message));
//             }
//         });
//     });
//     ws.on('close', function () {
//         console.log("lost one client");
//     });

//     console.log("new client connected");
// });

// cron.schedule('*/15 * * * * *', () => {
//     console.log('running a task every 15 seconds');
// });

// cron.schedule('*/30 * * * *', () => {
//     console.log("Will record consumption every 30 minutes");

// app.post('/automation')
// });
// cron.schedule('*/1 * * * * *', () => {
//     console.log("Will check for device state status also times in seconds");
// });
var port = process.env.PORT || 3000;

https.listen(port, function () {
    console.log('listening in http://localhost:' + port);
});
console.log('SERVER');