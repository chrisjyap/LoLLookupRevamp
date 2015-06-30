var express = require('express');
var config = require('../config.json');
var request = require('request');
var Q = require('q');
var router = express.Router();

const patchVer = '5.12.1';
const summonerURL ='v1.4/summoner/by-name/';
const summoner2URL='v1.4/summoner/';
const rankIconURL = 'v2.5/league/by-summoner/';
const statsURL = 'v1.3/stats/by-summoner/';
const staticChampURL= 'static-data/na/v1.2/champion/';
const ddragonURL = 'http://ddragon.leagueoflegends.com/cdn/'+ patchVer+ '/img/';

/* GET users listing. */
router.get('/query', function(req, res, next) {
  var user = req.query.summoner.replace(' ', '').trim();
  console.log('user: ', user);
  idRequest(user)
      .then(function(data){
        Q.all([rankIconRequest(data['id']), basicStatRequest(data['id']) ]).then(function(promiseData){
          //console.log('promiseData: ', promiseData);
          data['rankIcon'] = promiseData[0];
          data['rank'] = promiseData[0].substring(0, promiseData[0].indexOf('.')).replace(/[_]/gi, ' ');
          data['rank'] ==='unknown' ? data['rank'] = 'Unranked' : data['rank'];
          data['generalStats'] = promiseData[1];
          res.send(data);
        });
      })
      .catch(function(err){
        res.render('error', err)
      });
});

router.get('/rank', function(req, res){
  console.log('req:', req.query.id);
  rankStatRequest(req.query.id).then(function(data){
    res.send(data);
  });
});

module.exports = router;

var idRequest = function (summoner){
  var defer = Q.defer();
  request(buildURL('na/', summonerURL, summoner, '?'), function(err, response, data){
    if(err) defer.reject(err);
    data = JSON.parse(data);
    data = data[summoner];
    data.profileIcon = ddragonURL + 'profileicon/'+ data['profileIconId'] + '.png';
    defer.resolve(data);
  });
  return defer.promise;
};

var rankIconRequest = function(id){
  var defer = Q.defer();
  if(!id) defer.reject({message: 'No ID found.'});
  else{
    request(buildURL('na/', rankIconURL, id, '/entry?'), function(err, response, requestData){
      var rankIcon = 'unknown.png';
      if(response.statusCode === 200){
        requestData = JSON.parse(requestData);
        for(var i= 0; i<requestData[id].length; i++) {
          if(requestData[id][i]['queue'] === 'RANKED_SOLO_5x5'){
            rankIcon = requestData[id][i]['tier'] + '_' + requestData[id][i].entries[0].division + '.png';
            break;
          }
        }
      }
      defer.resolve(rankIcon);
    });
  }
  return defer.promise;
};

var basicStatRequest = function(id){
  var defer = Q.defer();
  if(!id) defer.reject({message: 'No ID found.'});
  else{
    var compObj = {
      'RankedSolo5x5': 'Solo Queue',
      'RankedTeam5x5': 'Ranked Team',
      'Unranked': 'Normals',
      'CAP5x5': 'Team Builder',
      'AramUnranked5x5': 'ARAM'
    };
    request(buildURL('na/', statsURL, id, '/summary?'), function(err, response, data){
      if(err) defer.reject(err);
      data = JSON.parse(data);
      var arr = [];
      var str = '';
      for(var i = 0; i< data['playerStatSummaries'].length; i++){
        str = data['playerStatSummaries'][i]['playerStatSummaryType'];
        if(str in compObj){
          data['playerStatSummaries'][i]['type'] = compObj[str];
          arr.push(data['playerStatSummaries'][i]);
        }
      }
      defer.resolve(arr);
    });
  }
  return defer.promise;
};

var rankStatRequest = function(id){
  var defer = Q.defer();
  var promises=[];
  if(!id) defer.reject({message: 'No ID found.'});
  else{
    request(buildURL('na/', statsURL, id, '/ranked?'), function(err, response, data){
      if(err) defer.reject(err);
      data = JSON.parse(data);
      for(var i = 0; i< data['champions'].length; i++){
        if(data['champions'][i]['id'] !== 0)
          promises.push(champLookup(data['champions'][i]['id']));
      }

      Q.all(promises).then(function(champData){
        var temp = {};
        console.log(champData);
        console.log(data);
        for(var i = 0; i< data['champions'].length; i++){
          console.log('id: ', data['champions'][i]['id']);
          if(data['champions'][i]['id'] !== 0){
            temp = JSON.parse(champData[i]);
            console.log(temp);
            data['champions'][i]['image']= ddragonURL+ 'champion/' + temp['key'] + '.png';
            data['champions'][i]['name']= temp['key'];
            data['champions'][i]['title']= temp['title'];
          }
        }
        console.log('data: ', data);
        defer.resolve(data);
      }).catch(function(err){
        console.log('err: ', err);
        defer.reject(err);
      });
    });
  }
  return defer.promise;
};

function champLookup(id){
  var defer = Q.defer();
  request(buildURL('', staticChampURL, id,'?'), function(err, response, data){
    if(err) defer.reject(err);
    defer.resolve(data);
  });
  return defer.promise;
}

function buildURL(region, url, summoner, option){
  //console.log('https://na.api.pvp.net/api/lol/'+ region + url + summoner + option);
  return 'https://na.api.pvp.net/api/lol/' + region +url + summoner + option + 'api_key=' + config.key;
}