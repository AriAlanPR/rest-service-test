let tba = require("../model/tba");
var fetch = require('node-fetch');
// const path = require('path');
// const cloudify = require('../model/cloudify');

var express = require('express');
// const child_process = require("child_process");
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log(req.query);
    
    res.render('index', {
        title: 'Rest request to Netsuite',
        data: JSON.stringify(req.query)
    });
});

//call netsuite restlet with data from edi form
router.post('/', async function(req, res){
    console.log(req.body);
    let body = req.body;

    let json = body.body;
    let headers = { 
        "Content-Type": "application/json",
    }
    
    if(body.netsuite_instance) {
        let organization = body.organization;
        let script = body.script;
        let deploy = body.deploy;
        
        if(!organization || !script || !deploy) {
            res.send({error: "invalid Netsuite url organization, script id or deploy. "});
        }
        
        var base_url = `https://${organization}.restlets.api.netsuite.com/app/site/hosting/restlet.nl`;
        var query = `?script=${script}&deploy=${deploy}`;
        let timestamp = body.timestamp;
        let signature = tba({timestamp: timestamp, netsuite_instance: body.netsuite_instance, method: body.method, base_url: base_url, query: query});
        headers.Authorization = signature;
        
    }
    console.log("headers", headers);
    console.log("base url", base_url);
    console.log("query", query);
    
    let response = await fetch(`${base_url}${query}`, {
        body: JSON.stringify(json),
        method: body.method,
        headers: headers
    });
    
    response = await response.text();
    
    //send response to user
    res.send(response);
});

//return router data to main node.js app module
module.exports = router;