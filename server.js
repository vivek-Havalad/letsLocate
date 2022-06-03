const express = require('express');
const corsAnywhere = require('cors-anywhere');
const app = express();
const expressHttpProxy = require('express-http-proxy');
const CORS_PROXY_PORT = 5600;

app.use('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});
app.use('/', express.static(__dirname + '/root'));
app.use(expressHttpProxy(`localhost:${CORS_PROXY_PORT}`));

corsAnywhere.createServer({}).listen(CORS_PROXY_PORT, () => {
    console.log(
        `Internal CORS Anywhere server started at port ${CORS_PROXY_PORT}`
    );
});

app.listen(3000, () => console.log('listening to port 3000'));