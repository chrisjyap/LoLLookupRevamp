/**
 * Created by Chris on 6/27/2015.
 */

var lolApp = angular.module('lolApp', [ 'ui.router', 'lolApp.search', 'lolApp.main']);

/*lolApp.value('profile', {});*/

lolApp.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/app");
    $stateProvider.state('app', {
        url: "/app",
        templateUrl: "/partials/_search.html"
    }).state('main',{
        url:'/main',
        params:{
           data: null
        },
        templateUrl:"/partials/_main.html"
    }).state('main.page', {
        url: '/:page/:child',
        params: {
            page: {value: null },
            child: { value: null},
            data: null
        },
        resolve: {
            deps: ['scriptLoader', function(scriptLoader){
                return scriptLoader;
            }]
        },
        templateProvider: function ($http, $stateParams, scriptLoader) {
            console.log('page: ', '/partials/_' + $stateParams.page + ( $stateParams.child ? "_" + $stateParams.child : "") + '.html');
            return $http.get('/partials/_' + $stateParams.page + ( $stateParams.child ? "_" + $stateParams.child : "") + '.html')
                .then(function(response) {
                    return scriptLoader.loadScriptTagsFromData(response.data);
                })
                .then(function(responseData){
                    return responseData;
                });
        }
    });
});