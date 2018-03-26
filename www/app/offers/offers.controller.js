'use strict';

/**
* @ngdoc controller
* @name offers.module.controller:OffersCtrl
* @requires $scope
* @requires $ionicTabsDelegate
* @requires OffersService
* @description
* Contains methods and views to display offer banners (have to configure them in OpenCart using i2CSMobile admin panel)
* and special priced products.
*/
angular
    .module('offers.module')
    .controller('OffersCtrl', function ($scope, $ionicTabsDelegate, OFFERS_PAGE_BANNER_ID, OffersService) {
        var vm = this;
        $scope.endOfOfferItems = false;
        $scope.data = {};
        $scope.data.latestPage = 1;
        $scope.loadingOffers = false;

        $scope.loadOfferBanners = function () {
            OffersService.GetOfferBanners(OFFERS_PAGE_BANNER_ID).then(function (data) {
                $scope.items = data.filter(function(a){
                    return a.image != "";
                });
            });
        }
        
        $scope.clicked = function () {
            $ionicTabsDelegate.select(0);
        }

        $scope.refreshUI = function () {
            $scope.endOfOfferItems = false;
            $scope.loadOfferItems(true);
        }

        $scope.loadOfferItems = function (refresh) {
            if ($scope.loadingOffers) {
                return;
            }

            $scope.loadingOffers = true;
            $scope.data.items = $scope.data.items || [];

            OffersService.GetSpecialProducts($scope.data.latestPage).then(function (data) {
                $scope.text_empty = "No offers!";

                if (refresh) {
                    $scope.data.items = data;
                    $scope.data.latestPage = 1;
                } else {
                    if ($scope.data.latestPage == 1) {
                        $scope.data.items = [];
                    }

                    $scope.data.items = $scope.data.items.concat(data);
                    $scope.data.latestPage++;
                }
                if (data && data.length < 1)
                    $scope.endOfOfferItems = true;
                $scope.loadingOffers = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, function (data) {
                $scope.loadingOffers = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }

        $scope.loadNextPage = function () {
            if (!$scope.endOfOfferItems) {
                $scope.loadOfferItems();
            } else {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
        }

        $scope.loadOfferBanners();
    });