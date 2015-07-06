/**
 * Created by Chris on 5/24/2015.
 */

angular.module('lolApp.search', []).controller('SearchController', function ($scope, $http, $state, localStorage){
    $scope.lookup = function(){
        var obj = localStorage.get(getKey($scope.search));
        obj ? $state.go('main', {data: JSON.parse(obj), previousState: $state.current.name}) : getBasicData();
    };

    function getBasicData(){
        $http.get('/users/query', {params: {summoner: $scope.search} }).success(function(data){
            var key = data.name.replace(' ', '').toLowerCase();
            localStorage.set(key, JSON.stringify(data));
            $state.go('main', {data: data, previousState: $state.current.name});
        });
    }
});

angular.module('lolApp.main', []).controller('MainController', function ($scope, $http, $state){
    console.log('main controller: ', $state.params);
    if($state.params.previousState === null) {
        console.log('Switching states...');
        $state.go('app');
    }
    else{
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
    }

});

angular.module('lolApp.rank', []).controller('RankController', function ($scope, $http, $state){
    getRankData();
    //console.log('Rank: ', $state.params);
    console.log('Rank state: ', $state.current.name);
    function getRankData(){
        $http.get('/users/rank', {params: {id: $state.params.data['id']}}).success(function(data){
            console.log('GET: ', data);
            $scope.rankData= data;
        });
    }

});

function clearActive(){
    var buttonList= document.querySelectorAll('div.header-buttons button');
    for(var i = 0; i<buttonList.length; i++)
        buttonList[i].className= 'btn btn-default';
}

function getKey(val){ return val.replace(' ', '').toLowerCase(); }