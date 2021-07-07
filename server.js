const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/dist/etak-start'));

app.get('/*', (req,res,next) => {
    res.sendFile(path.join(__dirname + '/dist/etak-start/index.html'));
});


app.listen(process.env.PORT || 8000);