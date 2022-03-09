var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log(req.query);

    res.render('xmlpp', {
        title: 'XML Pretty Print ',
        data: JSON.stringify(req.query)
    });
});

router.post('/', function(req, res){
    console.log(req.body);

    res.json(req.body);
});

router.get('/xmldata', function(req, res, next) {
    console.log(req.query);

    res.render('xmlpp', {
        title: 'XML Pretty Print ',
        data: JSON.stringify(req.query)
    });
});

module.exports = router;
