'use strict';

angular
    .module('paypal.module')
    .controller('PaymentPaypalCtrl', function ($scope, $rootScope, $stateParams, $state, $ionicLoading, CartService, PaymentPaypalService) {

        $scope.payment_initiated = false;

        $scope.pay = function () {
            $ionicLoading.show();

            $scope.payment_initiated = true;

            CartService.AddOrder($scope.checkout).then(function (data) {
                $ionicLoading.hide();

                // set cart badge to empty
                $rootScope.cartItemCount = "";

                if (data && data.result == "success" && data.redirect) {
                    PaymentPaypalService.OpenPaymetWindow(data.redirect).then(function (data) {
                        placeOrderOnSuccessReturn(data);
                    }, function (data) {
                        alert(JSON.stringify(data));
                        $scope.payment_initiated = false;
                    });
                }
            }, function (data) {
                if (angular.isString(data)) {
                    alert(data);
                    $ionicLoading.hide();
                }

                $ionicLoading.hide();
            });
        }

        $scope.$on('$ionicView.enter', function () {
            $scope.checkout = $stateParams.checkout;
            //$scope.total_amount_clean = $stateParams.total_amount_clean;
            $scope.success_state = $stateParams.success_state;
            //$scope.order_id = $stateParams.order_id;
            //$scope.currency = $stateParams.currency;
            $scope.total_amount = $stateParams.total_amount;
            $scope.pay();
        });

        var placeOrderOnSuccessReturn = function (data) {
            var instructions = "";
            if (data && data.order_id)
                instructions = "Completed with id : " + data.order_id;

            $state.go($scope.success_state, { instructions: instructions }, { reload: true });
        }
    });