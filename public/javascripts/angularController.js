/**
 * Created by Chris on 5/24/2015.
 */

angular.module('myApp.menu', []).controller('MenuController', function ($scope, $http, summonerID){
    $scope.sumID = summonerID;
    console.log($scope.sumID);

});