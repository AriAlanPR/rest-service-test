
var fetch = require('node-fetch');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log(req.query);
    
    res.render('prettyprint', {
        title: 'Pretty printer view',
        data: JSON.stringify(req.query)
    });
});

router.post('/', async function(req, res){
    console.log(req.body);
    let body = req.body;

    let json = body.body;

    let response = await fetch(body.url, {
        body: json,
        method: body.method,
        headers: { 
            "Content-Type": "application/json"
        }
    });

    response = await response.json();

    res.json(response);
});

module.exports = router;