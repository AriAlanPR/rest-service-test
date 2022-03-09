let tba = require("../model/tba");
var fetch = require('node-fetch');

var express = require('express');
const req = require('express/lib/request');
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
    let headers = { 
        "Content-Type": "application/json",
    }
    
    if(body.netsuite_instance) {
        let urldata = body.url.split('?');

        if(urldata.length != 2) {
            res.send({error: "invalid Netsuite url encountered. "});
        }

        let base_url = urldata[0];
        let query = urldata[1];
        let timestamp = body.timestamp;
        let signature = tba({timestamp: timestamp, netsuite_instance: body.netsuite_instance, method: body.method, base_url: base_url, query: query});
        headers.Authorization = signature;
        
    }
    console.log("headers", headers);

    let response = await fetch(body.url, {
        body: JSON.stringify(json),
        method: body.method,
        headers: headers
    });

    response = await response.text();

    res.send(response);
});

module.exports = router;