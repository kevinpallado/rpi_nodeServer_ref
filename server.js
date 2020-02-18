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
const db = require('./connection');

let https = require('http').Server(app);
let io = require('socket.io')(https);

//io.path('/pathway');


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
// const WebSocket = require('ws');
// const s = new WebSocket.Server({ server: server, path: "/echo", noServer: true });

app.use('/automation', routes.Router);
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


var devices = [];
var consumption = [];
var window = [];
var sql_view = "SELECT * from registered_devices";
db.sql.query(sql_view, (err, rows, results) => {
    if (err) {
        console.log(err);
    }
    else {
        rows.forEach(element => {
            devices.push(element.macAddress)
        });
    }
});
app.post('/data-receiver', async (req, res) => {

    for (var i = 0; i < devices.length; i++) {
        if (devices[i] == req.body['macAddress']) {
            consumption.push(req.body);
        }

        if (req.body['device'] == 'Window') {
            if (devices[i] == req.body['macAddress']) {

                //console.log(req.body);
                window.push(req.body);
            } else {

            }

        }
    }
    // console.log("res");
    // notes.push(req.body['macAddress']);


    //console.log(res);
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


io.sockets.on('connection', function (socket, soc) {
    console.log("connected on the Socket");
    sendData(socket);
    windowData(socket);
})

// let number = 0;

// function window(socket) {
//     result = [...new Map(consumption.map(x => [x.macAddress, x])).values()]
//     if (result == '') {

//     } else {
//         for (var i = 0; i <= result.length; i++) {
//             if (result[i].device == 'Door') {
//                 console.log("has Data");
//             } else {
//                 console.log("No Data");
//             }
//         }
//     }
// }


function windowData(socket) {
    result = [...new Map(window.map(x => [x.macAddress, x])).values()]
    if (result == '') {

    } else {
        // console.log(result);
        for (var i = 0; i <= result.length; i++) {

            if (result[i]) {
                if (result[i] == undefined) {
                    console.log("undefined");
                } else {
                    socket.emit('window', {
                        macAddress: result[i].macAddress,
                        deviceID: result[i].deviceID,
                        state: result[i].state,
                    });
                }
            }

        }
    }
    setTimeout(() => {
        windowData(socket);

    }, 2000);
}
function sendData(socket) {

    result = [...new Map(consumption.map(x => [x.macAddress, x])).values()]
    if (result == '') {


    } else {
        for (var i = 0; i <= result.length; i++) {

            if (result[i]) {
                if (result[i] == undefined) {
                    console.log("undefined");
                } else {
                    socket.emit(result[i].macAddress, {
                        macAddress: result[i].macAddress,
                        deviceID: result[i].deviceID,
                        power: result[i].power,
                        current: result[i].current,
                        voltage: result[i].voltage,
                        device: result[i].device
                    });
                }
            }

        }
    }
    setTimeout(() => {
        sendData(socket);

    }, 2000);
}


cron.schedule('*/5 * * * * *', () => {
    result = [...new Map(consumption.map(x => [x.macAddress, x])).values()]

    if (result == '') {

    } else {

    }
    if (result) {
        for (var i = 0; i < result.length; i++) {
            // var sql_device_consumptions = "INSERT INTO consumptions (voltage,current,power,deviceID) VALUES ('" + result[i].voltage + "','" + result[i].current + "','" + result[i].power + "','" + result[i].deviceID + "')";
            // db.sql.query(sql_device_consumptions, (err, rows, results) => {
            //     if (err) {
            //         console.log(err);
            //     }
            //     else {
            //         console.log("Inserted Consumptions");
            //     }
            // });
        }
    } else {
        console.log("nothing");
    }

});





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