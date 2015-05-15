var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('not get');
  res.send('respond with a resource');
});

router.post('/', function(req, res){
  console.log('here');
  res.render('user');
});

module.exports = router;
