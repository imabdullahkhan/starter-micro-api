var http = require('http');
require('dotenv').config();
http.createServer(function (req, res) {
    console.log(`Just got a request at ${req.url}!`)
    res.write(`Yo!!!!${process.env.port}`);
    res.end();
}).listen(process.env.PORT || 3000);