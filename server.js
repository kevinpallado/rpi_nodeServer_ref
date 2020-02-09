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

io.path('/echo');


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

app.post('/data-receiver', async (req, res) => {
    
    // req.body dayun ang data gaw
    /**
     * Ang json data dayun kay kani
     * kung appliances
     * {
     * "macAddress" = asdasd,
        "accoundId" = 1,
        "deviceId" = 4,
     *  "power" = 20,
        "e_usage" = 45,
        "e_cost" = 2.05,
        "device" = "Appliances",
        "state" = 0
     * }
     kung door
     {
     * "macAddress" = asdasd,
        "accoundId" = 1,
        "deviceId" = 4,
        "device" = "Door",
        "state" = 0
     * }
     kung window ( si window walay command nga mag open or close igo ra niya e update ang user nga na open or close ang window mag notify dayun ka gaw if na open ang window)
     {
     * "macAddress" = asdasd,
        "accoundId" = 1,
        "deviceId" = 4,
        "device" = "Door",
        "state" = 0
     * }
     */
});

var notes = [];
io.sockets.on('connection', function (socket) {

    console.log("connected on the Socket");
    // sendData1(socket); // Excisting Socket
    socket.on('DataOfConsumption', function (data) {
        notes.push(data)
    });
})


cron.schedule('*/5 * * * * *', () => {
    console.log("5 Seconds");
    console.log(notes);
    io.sockets.on('DataOfConsumption', function (data) {
        notes.push(data);

        // var sql_search = "INSERT INTO consumptions (voltage, current, power, deviceID, accountID) VALUES ('" + data.voltage + "','" + data.current + "','" + data.power + "','" + 53 + "','" + 6 + "')";
        // db.sql.query(sql_search, (err, rows, results) => {
        //     resolve(rows.length);
        //     console.log(rows.length);
        // });
    });




    // function sendData(socket) {
    //     socket.emit('data1', {  
    //         voltage: voltage,
    //         current: current,
    //         power: power,
    //         _id: 53,
    //         created: new Date(),
    //     });

    //     setTimeout(() => {
    //         sendData(socket);
    //         voltage++;
    //         current++;
    //         power++;
    //     }, 2000);
    // }
});

// function sendData(socket) {
//     socket.emit('data1', {
//         voltage: voltage,
//         current: current,
//         power: power,
//         _id: 53,
//         created: new Date(),
//     });

//     setTimeout(() => {
//         sendData(socket);
//         voltage++;
//         current++;
//         power++;
//     }, 2000);
// }





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