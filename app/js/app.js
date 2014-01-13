'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('sniff', [
  'firebase',
  'ngRoute',
  'ngGrid',
  'sniff.filters',
  'sniff.services',
  'sniff.directives',
  'sniff.controllers'
]).

value('fbUrl', 'https://abab-sniff-test.firebaseio.com/test1/').

factory('Materials', function(angularFireCollection, fbUrl) {
  return angularFireCollection(new Firebase(fbUrl));
}).

config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'partials/list.html',
                            controller: 'ListControl'});
  // FIXME: this means materialID can't be "new". Get better url schema.
  $routeProvider.when('/materials/new',
                      {templateUrl: 'partials/detail.html',
                       controller: 'CreateControl'});
  $routeProvider.when('/materials/:materialId/render',
                      {templateUrl: 'partials/rendered.html',
                       controller: 'RenderControl'});
  $routeProvider.when('/materials/:materialId',
                      {templateUrl: 'partials/detail.html',
                       controller: 'EditControl'});
  $routeProvider.otherwise({redirectTo: '/'});
}]);
