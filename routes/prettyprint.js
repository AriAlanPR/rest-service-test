var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log(req.query);

    res.render('prettyprint', {
        title: 'Pretty printer view',
        data: JSON.stringify(req.query)
    });
});

router.post('/', function(req, res){
    console.log(req.body);

    res.json(req.body);
});

router.get('/xmldata', function(req, res, next) {
    
});

module.exports = router;
