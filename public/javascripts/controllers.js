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
    console.log('state: ', $state.current.name);
    $state.go('main.page', { page: 'stats', child: null });

    $scope.navigate = function(event){
        if(event.target.className.indexOf('active') === -1){
            clearActive();
            event.target.className+= ' active';
            console.log('event: ', event.target.innerHTML);
            $state.go('main.page', {page: event.target.innerHTML.toLowerCase(), child:null});
        }
    };
});

angular.module('lolApp.rank', []).controller('RankController', function ($scope, $http, $state){
    console.log('Rank: ', $state.params);
    //$scope.data= $state.params.data;
    console.log('Rank state: ', $state.current.name);

    $http.get('/users/rank', {params: {id: $state.params.data['id']}}).success(function(data){
        console.log('GET: ', data);
        $scope.rankData= data;
    });
});

function clearActive(){
    var buttonList= document.querySelectorAll('div.header-buttons button');
    for(var i = 0; i<buttonList.length; i++)
        buttonList[i].className= 'btn btn-default';
}