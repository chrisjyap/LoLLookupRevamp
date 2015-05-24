var express = require('express');
var config = require('../config.json');
var request = require('request');
var Q = require('q');
var router = express.Router();

const patchVer = '5.9.1';
const summonerURL ='v1.4/summoner/by-name/';
const summoner2URL='v1.4/summoner/';
const iconURL = 'http://ddragon.leagueoflegends.com/cdn/'+ patchVer+ '/img/profileicon/';

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.query.summoner);
  var summoner = req.query.summoner.replace(' ', '').trim();
  console.log('here', summoner);
  request(buildURL('na/', summonerURL, summoner, '?'), function(err, response, data){
    data = JSON.parse(data);
    data = data[summoner];
    console.log(data);
    data.profileIcon = iconURL + data['profileIconId'] + '.png';
    res.render('user', data);
  });
});


module.exports = router;


function buildURL(region, url, summoner, option){
  //console.log('https://na.api.pvp.net/api/lol/' + url + summoner + option);
  return 'https://na.api.pvp.net/api/lol/' + region +url + summoner + option + 'api_key=' + config.key;
}