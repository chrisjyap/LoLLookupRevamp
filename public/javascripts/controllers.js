/**
 * Created by Chris on 5/24/2015.
 */

angular.module('lolApp.search', []).controller('SearchController', function ($scope, $http, $state){
    $scope.lookup = function(){
        console.log('summoner: ', $scope.search);
        $http.get('/users/query', {params: {summoner: $scope.search} }).success(function(data){
            $state.go('main', {data: data});
        });
    }
});

angular.module('lolApp.main', []).controller('MainController', function ($scope, $http, $state){
    console.log('controller: ', $state.params);
    $scope.data= $state.params.data;
    $scope.rank = $scope.data.rankIcon.substring(0, $scope.data.rankIcon.indexOf('.')).replace(/[_]/gi, ' ');
    if($scope.rank === 'unknown') $scope.rank = 'Unranked';
});