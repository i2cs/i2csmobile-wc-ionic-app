'use strict';

/**
* @ngdoc controller
* @name info.module.controller:InfoCtrl
* @requires $scope
* @requires $rootScope
* @requires $state
* @requires $stateParams
* @requires $localStorage
* @requires notificationService
* @requires LANGUAGES
* @requires INTERCOM_INTEGRATION
* @requires DEMO_MODE
* 
* @description
* Shows the home page of info module. Contains user language switch which invokes a method
* defined in `rootScope`. Need to change `$scope.lanuages` variable if new languages are added or
* existing are removed.
*/
angular
    .module('info.module')
    .controller('InfoCtrl', function ($scope, $rootScope, $state, $stateParams, $localStorage, notificationService, LANGUAGES, INTERCOM_INTEGRATION, DEMO_MODE) {
        var vm = this;
        $scope.demo_mode = DEMO_MODE;
        $scope.chat_enabled = INTERCOM_INTEGRATION;

        $scope.$on('$ionicView.enter', function () {
            
            $rootScope.$broadcast('i2csmobile.more');

            if ($stateParams.redirect) {
                $state.go("app.menu.info." + $stateParams.redirect);
                $stateParams.redirect = "";
            }
        });

        $scope.info = {};
        $localStorage.silent = $localStorage.silent || false;
        $scope.info.notifications = !$localStorage.silent;

        $scope.languages = LANGUAGES;

        $scope.info.language = window.localStorage.lang ? window.localStorage.lang : 'en-US'

        $scope.toggleNotifications = function () {
            if ($scope.info.notifications) {
                $localStorage.silent = false;
                notificationService.subscribeForPush();
            } else {
                $localStorage.silent = true;
                notificationService.unsubscribeFromPush();
            }
        }

        $scope.openChat = function () {
            $rootScope.$broadcast('i2csmobile.intercom');
        }
    });

/**
* @ngdoc controller
* @name info.module.controller:InfoOrdersCtrl
* @requires $scope
* @requires $ionicLoading
* @requires InfoService
* @description
* Shows the list of past orders of a logged in customer.
*/
angular
    .module('info.module')
    .controller('InfoOrdersCtrl', function ($scope, $ionicLoading, CURRENCY_SYMBOL, DATE_FORMAT, InfoService) {
        var vm = this;

        $ionicLoading.show();
        InfoService.GetOrders().then(function (data) {
            $scope.orders = data.orders;
            $ionicLoading.hide();
        }, function (data) {
            $ionicLoading.hide();
        });

    });

/**
* @ngdoc controller
* @name info.module.controller:InfoLoadOrderCtrl
* @requires $scope
* @requires $ionicLoading
* @requires $stateParams
* @requires InfoService
* @description
* Shows information and invoice of an order.
*/
angular
    .module('info.module')
    .controller('InfoLoadOrderCtrl', function ($scope, $ionicLoading, $stateParams, CURRENCY_SYMBOL, DATE_FORMAT, InfoService) {
        var vm = this;

        $ionicLoading.show();
        InfoService.GetOrder($stateParams.id).then(function (data) {
            $scope.products = data.line_items;
            var cart_total = 0;

            for (var i in data.line_items) {
                cart_total += data.line_items[i].price * parseFloat(data.line_items[i].quantity);
            }

            var totals = [];
            totals.push({ title: "Sub-Total", text: cart_total });
            if (data.cart_tax > 0)
                totals.push({ title: "Taxes", text: data.cart_tax });
            if (data.shipping_total > 0)
                totals.push({ title: "Shipping", text: parseFloat(data.shipping_total) + parseFloat(data.shipping_tax) });
            if (data.discount_total > 0)
                totals.push({ title: "Discounts", text: data.discount_total });
            totals.push({ title: "Total", text: data.total });

            $scope.totals = totals;

            $scope.invoice_no = data.order_key;
            $scope.order_id = data.id;
            $scope.date_added = data.date_completed || data.date_created;
            var address = data.shipping.first_name + " " + data.shipping.last_name + '<br>' + data.shipping.address_1 + '<br>' + data.shipping.address_2 + '<br>' + data.shipping.city + '<br>' + data.shipping.state + '<br>' + data.shipping.postcode + '<br>' + data.shipping.country;
            $scope.shipping_address = address;
            //$scope.shipping_method = data.shipping_method;
            $scope.payment_method = data.payment_method_title;

            $scope.histories = data.histories;

            $ionicLoading.hide();
        }, function (data) {
            $ionicLoading.hide();
        });
    });

/**
* @ngdoc controller
* @name shop.module.controller:InfoWishlistCtrl
* @requires $scope
* @requires $state
* @requires $ionicLoading
* @requires $ionicTabsDelegate
* @requires InfoService
* @description
* Display current wishlist.
*/
angular
    .module('info.module')
    .controller('InfoWishlistCtrl', function ($scope, $state, $ionicLoading, $ionicTabsDelegate, InfoService) {

        $scope.loadWishlist = function () {
            $ionicLoading.show();
            InfoService.GetWishlist().then(function (data) {
                $scope.items = data;
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            }, function (data) {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            })
        }

        $scope.refreshUI = function () {
            $scope.loadWishlist();
        }

        $scope.goToShop = function () {
            $ionicTabsDelegate.select(0);
        }

        $scope.removeItem = function (id) {
            $ionicLoading.show();
            InfoService.RemoveFromWishlist(id).then(function (data) {
                $scope.loadWishlist();
            }, function (data) {
                $scope.loadWishlist();
            });
        }

        $scope.$on('$ionicView.enter', function () {
            $scope.loadWishlist();
        });
    });