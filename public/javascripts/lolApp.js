/**
 * Created by Chris on 6/27/2015.
 */

var lolApp = angular.module('lolApp', [ 'ui.router', 'lolApp.search', 'lolApp.main', 'lolApp.rank']);


lolApp.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/app");
    $stateProvider.state('app', {
        url: "/app",
        templateUrl: "/partials/_search.html"
    }).state('main',{
        url:'/main',
        params:{
            data: null,
            previousState: null
        },
        templateUrl:"/partials/_main.html"
    }).state('main.page', {
        url: '/:page/:child',
        params: {
            page: {value: null },
            child: { value: null}
        },
        templateProvider: function ($http, $stateParams) {
            console.log('page: ', '/partials/_' + $stateParams.page + ( $stateParams.child ? "_" + $stateParams.child : "") + '.html');
            return $http.get('/partials/_' + $stateParams.page + ( $stateParams.child ? "_" + $stateParams.child : "") + '.html')
                .then(function(response) {
                    return response.data;
                });
        }
    });
});

lolApp.factory('localStorage', function($window){
    return {
        set: function(key, val) {
            $window.localStorage.setItem(key, val);
            return this;
        },
        get: function(key) {
            return $window.localStorage.getItem(key);
        },
        clear: function(){
            $window.localStorage.clear();
        }
    };
});