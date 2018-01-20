'use strict';

/**
* @ngdoc directive
* @name starter.directive:menuSwitch
* @description
* Widget to render menu format switch.
* @example
<pre>
    <menu-switch></menu-switch>
</pre>
*/
angular.module('starter')
   .directive('menuSwitch', function () {
       return {
           scope: {},
           link: function (scope, element, attrs) {
               
           },
           controller: ['$rootScope', '$scope', function ($rootScope, $scope) {
               $scope.d = $rootScope.data;
           }],
           templateUrl: 'app/common/widgets/menu-switch/menu-switch-template.html'
       };
   });