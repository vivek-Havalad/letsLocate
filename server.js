const express = require('express');
const corsAnywhere = require('cors-anywhere');
const app = express();
const expressHttpProxy = require('express-http-proxy');
require('dotenv').config()
console.log()

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.sendStatus(200);
        res.end();
      } else {
        //move on
        next();
      }
});
app.get('/key', (req, res) => {
    res.send(process.env.SECRET_KEY);
    res.end();
});
app.use('/', express.static(__dirname + '/root'));
app.use(expressHttpProxy(`localhost:${process.env.CORS_PROXY_PORT}`));

corsAnywhere.createServer({}).listen(process.env.CORS_PROXY_PORT, () => {
    console.log(
        `Internal CORS Anywhere server started at port ${process.env.CORS_PROXY_PORT}`
    );
});



app.listen(process.env.PORT, () => console.log('listening to port 3000'));