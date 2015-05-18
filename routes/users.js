var express = require('express');
var config = require('../config.json');
var request = require('request');
var router = express.Router();

const baseURL = 'https://na.api.pvp.net/api/lol/';
const summonerURL ='v1.4/summoner/by-name/';
const summoner2URL='v1.4/summoner/';


/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('not get');
  res.send('respond with a resource');
});

router.post('/', function(req, res){
  console.log('here', req.body);
  request(buildURL(baseURL, 'na/', summonerURL, req.body.summoner, '?'), function(err, response, data){
    data = JSON.parse(data);
    console.log(data);
  });
  res.render('user');
});

module.exports = router;


function buildURL(base, region, url, summoner, option){
  //console.log(base + url + summoner + option + key);
  return base + region +url + summoner + option + 'api_key=' + config.key;
}