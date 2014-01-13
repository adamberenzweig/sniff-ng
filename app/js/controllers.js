'use strict';

/* Controllers */

var controllerModule = angular.module('sniff.controllers', ['ui.bootstrap']);

controllerModule.controller('ListControl', ['$scope', 'Materials',
    function($scope, Materials) {
      $scope.materials = Materials;
    }]);

// TODO(madadam):
// * Edit components in place, using editable grid (jquery ui plugin?).
// * Unify create and edit controls, so we can create components without
//   saving first.
// * Accord rendering logic.
// * Navbar or breadcrumbs, navigation back to home from detail, e.g.

controllerModule.controller('CreateControl',
                            ['$scope', '$location', '$timeout', 'Materials',
    function($scope, $location, $timeout, Materials) {
      $scope.save = function() {
        Materials.add($scope.material, function() {
          $timeout(function() { $location.path('/'); });
        });
      }
    }]);

controllerModule.controller('EditControl',
                            ['$scope', '$location', '$routeParams',
                            'angularFire', 'fbUrl', 'Materials',
    function($scope, $location, $routeParams, angularFire, fbUrl, Materials) {
      angularFire(new Firebase(fbUrl + $routeParams.materialId),
                  $scope, 'remote').
      then(function() {
        $scope.material = angular.copy($scope.remote);
        $scope.material.$id = $routeParams.materialId;
        $scope.isClean = function() {
          return angular.equals($scope.remote, $scope.material);
        };
        $scope.destroy = function() {
          $scope.remote = null;
          $location.path('/');
        };
        $scope.save = function() {
          $scope.remote = angular.copy($scope.material);
          $location.path('/');
        };

        // FIXME
        /*
        $scope.componentGridOptions = {
          data: 'material.components',
          enableCellSelection: true,
          enableRowSelection: false,
          enableCellEdit: true,
          columnDefs: [{field: 'accord_name', displayName: 'Accord',
                        enableCellEdit: false},
                       {field: 'amount', displayName: 'Amount',
                        enableCellEdit: true},
                       {field: 'dilution', displayName: 'Dilution',
                        enableCellEdit: true},
          ],
        };
        */

        $scope.accord_list = Materials;

        $scope.findByName = function(name) {
          // TODO(madadam): Build a dict by name (and keep updated).
          for (var i = 0; i < Materials.length; i++) {
            var m = Materials[i];
            if (m.name == name) {
              return m;
            }
          }
          return undefined;
        }

        $scope.new_component = {}

        $scope.selectComponent = function() {
          var component = $scope.new_component;
          var selected = $scope.findByName(component.accord_name);
          component.accord_id = selected.$id;
        }

        $scope.addComponent = function() {
          if (!$scope.new_component.hasOwnProperty('accord_name')) {
            // FIXME: Validation error, no component has been selected.
            return;
          }
          if (!$scope.material.hasOwnProperty('components')) {
            console.log('Creating components child.');
            $scope.material.components = [];
          }
          //$scope.material.child('components').pushd($scope.new_component);
          $scope.material.components.push($scope.new_component);
          // sync to firebase.
          $scope.remote = angular.copy($scope.material);
          $scope.new_component = {}
        }

        $scope.removeComponent = function(c) {
          var index_to_delete = -1;
          for (var i = 0; i < $scope.material.components.length; i++) {
            if ($scope.material.components[i].$$hashKey == c.$$hashKey) {
              index_to_delete = i;
            }
          }
          console.log("index to delete: " + index_to_delete);
          if (index_to_delete >= 0) {
            $scope.material.components.splice(index_to_delete, 1);
          }
          $scope.remote = angular.copy($scope.material);
        }

        $scope.LogToConsole = function(x) {
          console.log(x);
        }
      });
    }]);


controllerModule.controller('RenderControl',
                            ['$scope', '$location', '$routeParams',
                            'angularFire', 'fbUrl', 'Materials',
    function($scope, $location, $routeParams, angularFire, fbUrl, Materials) {
      angularFire(new Firebase(fbUrl + $routeParams.materialId),
                  $scope, 'remote').
      then(function() {
        $scope.material = angular.copy($scope.remote);
        $scope.material.$id = $routeParams.materialId;

        // FIXME: Implement rendering.
        $scope.rendered_components = $scope.material.components;
      });
    }]);
