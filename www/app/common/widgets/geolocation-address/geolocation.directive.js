'use strict';

/**
* @ngdoc directive
* @name shop.module.directive:geolocationAddress
* @description
* Loads geolocation address of current GPS location. 
* @example
<pre>
    <geolocation-address line1="line1" line2="line2" city="city" postal="postalcode" country="country" state="state"></geolocation-address>
</pre>
*/
angular.module('starter')
    .directive('geolocationAddress', function () {
    return {
        restrict: 'E',
        scope: {
            line1: '=line1',
            line2: '=line2',
            city: '=city',
            postalcode: '=postalcode',
            country: '=country',
            state: '=state'
        },
        controller: ['$scope', '$http', '$cordovaGeolocation', 'dataService', function ($scope, $http, $cordovaGeolocation, dataService) {
            var posOptions = { timeout: 10000, enableHighAccuracy: false };

            $scope.load = function () {
                $scope.loading = true;
                $cordovaGeolocation
                  .getCurrentPosition(posOptions)
                  .then(function (position) {
                      var lat = position.coords.latitude;
                      var long = position.coords.longitude;

                      dataService.apiSecuredGet('/customers/geolocationaddress', { lat: lat, lng: long }).then(function (data) {
                          $scope.line1 = data.address_line1;
                          $scope.line2 = data.address_line2;
                          $scope.city = data.city;
                          $scope.postalcode = data.postalcode;
                          $scope.country = data.country;
                          $scope.state = data.state;

                          $scope.loading = false;
                      }, function () {
                          $scope.loading = false;
                      });
                  }, function (err) {
                      $scope.loading = false;
                      alert("Error loading address from GPS");
                  });
            }
           
        }],
        templateUrl: 'app/common/widgets/geolocation-address/geolocation-template.html'
    };
});