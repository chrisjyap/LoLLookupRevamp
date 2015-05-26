/**
 * Created by Chris on 5/24/2015.
 */

angular.module('myApp.menu', []).controller('MenuController', function ($scope, $http, summonerID, rank){
    $scope.sumID = summonerID;
    $scope.rank = rank.substring(0, rank.indexOf('.')).replace(/[_]/gi, ' ');
    if($scope.rank === 'unknown') $scope.rank = 'Unranked';
    console.log($scope.sumID);

});