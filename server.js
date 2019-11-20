const express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    routes = require('./routes/routes'),
    crypto = require('crypto'),
    static = require('node-static'),
    file = new static.Server('./'),
    app = express(),
    port = 3210;

app.listen(3000);

app.use(bodyParser.json());

app.use('/automation', routes);

const server = http.createServer((req, res) => {
    req.addListener('end', () => file.serve(req, res)).resume();
  });

server.listen(port, () => {
    console.log(`Websocket Server running at http://localhost:${port}`);
});

server.on('upgrade', function(req, socket) {
    if(req.headers['upgrade'] !== 'websocket') {
        socket.end('HTTP/1.1 400 Bad Request');
        return;
    }
});

function generateAcceptValue (acceptKey) 
{
    return crypto
    .createHash('sha1')
    .update(acceptKey + '258EAFA5-E914–47DA-95CA-C5AB0DC85B11', 'binary')
    .digest('base64');
}