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
  //console.log(req.query.summoner);
  var user = req.query.summoner.replace(' ', '').trim();
  console.log('user: ', user);
  firstRequest(user)
      .then(function(data){
        res.render('user', data);
      })
      .catch(function(err){
        res.render('error', err)
  });
});


module.exports = router;

var firstRequest = function (summoner){
  var defer = Q.defer();
  request(buildURL('na/', summonerURL, summoner, '?'), function(err, response, data){
    if(err) defer.reject(err);
    data = JSON.parse(data);
    data = data[summoner];
    data.profileIcon = iconURL + data['profileIconId'] + '.png';
    defer.resolve(data);
  });
  return defer.promise;
};


function buildURL(region, url, summoner, option){
  //console.log('https://na.api.pvp.net/api/lol/' + url + summoner + option);
  return 'https://na.api.pvp.net/api/lol/' + region +url + summoner + option + 'api_key=' + config.key;
}