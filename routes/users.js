var express = require('express');
var config = require('../config.json');
var request = require('request');
var Q = require('q');
var router = express.Router();

const patchVer = '5.9.1';
const summonerURL ='v1.4/summoner/by-name/';
const summoner2URL='v1.4/summoner/';
const rankIconURL = 'v2.5/league/by-summoner/';
const statsURL = 'v1.3/stats/by-summoner/';
const iconURL = 'http://ddragon.leagueoflegends.com/cdn/'+ patchVer+ '/img/profileicon/';

/* GET users listing. */
router.get('/', function(req, res, next) {
  //console.log(req.query.summoner);
  var user = req.query.summoner.replace(' ', '').trim();
  console.log('user: ', user);
  idRequest(user)
      .then(rankIconRequest)
      .then(function(data){
        res.render('user', data);
      })
      .catch(function(err){
        res.render('error', err)
      });
});

module.exports = router;

var idRequest = function (summoner){
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

var rankIconRequest = function(data){
  var defer = Q.defer();
  if(!data.id) defer.reject({message: 'No ID found in data.'});
  else{
    request(buildURL('na/', rankIconURL, data.id, '/entry?'), function(err, response, requestData){
      var rankIcon = 'unknown.png';
      if(response.statusCode === 200){
        requestData = JSON.parse(requestData);
        for(var i= 0; i<requestData[data.id].length; i++) {
          if(requestData[data.id][i]['queue'] === 'RANKED_SOLO_5x5'){
            rankIcon = requestData[data.id][i].tier + '_' + requestData[data.id][i].entries[0].division + '.png';
            break;
          }
        }
      }
      data['rankIcon'] = rankIcon;
      defer.resolve(data);
    });
  }
  return defer.promise;
};

var basicStatRequest = function(data){
  var defer = Q.defer();
  if(!data.id) defer.reject({message: 'No ID found in data.'});
  else{
    request(buildURL('na/', statsURL, data.id, '/summary?'), function(err, response, data){
      if(err) defer.reject(err);
      //todo: filter basic stat data
      defer.resolve(data);
    });
  }
  return defer.promise;
};

function buildURL(region, url, summoner, option){
  //console.log('https://na.api.pvp.net/api/lol/'+ region + url + summoner + option);
  return 'https://na.api.pvp.net/api/lol/' + region +url + summoner + option + 'api_key=' + config.key;
}