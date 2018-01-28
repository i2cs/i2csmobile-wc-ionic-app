'use strict';

/**
* @ngdoc controller
* @name cart.module.controller:CartHomeCtrl
* @requires $scope
* @requires $rootScope
* @requires $ionicLoading
* @requires CartService
* @description
* Show the home page of cart module. Contains the items of current shopping cart. Lists down
* all items added to the cart. Can proceed to the next step of the checkout process.
*/
angular
    .module('cart.module')
    .controller('CartHomeCtrl', function ($scope, $rootScope, $ionicLoading, CartService, COUPONS_ENABLED) {
        var vm = this;
        $scope.items = [];
        $scope.dataLoaded = false;
        $scope.coupons_enabled = COUPONS_ENABLED;

        $scope.loadCart = function () {
            $ionicLoading.show();
            CartService.GetCart().then(function (data) {
                $scope.items = data.products;
                $scope.totals = data.totals;
                $scope.total_amount_clean = data.total_amount_clean;
                $scope.total_amount = data.total_amount;
                $rootScope.currency = data.currency;
                $rootScope.cartItemCount = parseInt(data.total_item_count);
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                $scope.dataLoaded = true;
            }, function (data) {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                $scope.dataLoaded = true;
            });
        }

        $scope.removeCartItem = function (id) {
            CartService.RemoveCartItem(id).then(function (data) {
                $scope.loadCart();
            });
        }

        $scope.quantityChanged = function (cartItemId, quantity) {
            $ionicLoading.show();
            // save cart item quantity
            CartService.UpdateCartItemQuantity(cartItemId, quantity).then(function (data) {
                $scope.loadCart();
            }, function (data) {
                alert("Error while changing the quantity. Please try again");
                $ionicLoading.hide();
            });
        }

        $scope.submitCoupon = function (coupon) {
            $ionicLoading.show();
            // save cart item quantity
            CartService.ApplyCoupon(coupon).then(function (data) {
                $scope.loadCart();
                $ionicLoading.hide();
                $scope.couponAdded = true;
                alert(data.success);
            }, function (data) {
                alert(data);
                $scope.loadCart();
                $ionicLoading.hide();
                $scope.couponAdded = false;
            });
        }

        $scope.$on('$ionicView.enter', function () {
            $scope.dataLoaded = false;
            $scope.loadCart();
        });

    });

/**
* @ngdoc controller
* @name cart.module.controller:CartCheckoutCtrl
* @requires $scope
* @requires $rootScope
* @requires $state
* @requires $localStorage
* @requires $ionicModal
* @requires $ionicLoading
* @requires $ionicPopup
* @requires appService
* @requires CartService
* 
* @description
* Contains checkout process. Customer can place an order by providing personal information, selecting 
* a shipping method and a payment method. If selected payment method is registered as a module in the app,
* it initiates the online payment flow as the last step of the checkout procedure.
*/
angular
    .module('cart.module')
    .controller('CartCheckoutCtrl', function ($scope, $rootScope, $state, $localStorage, $ionicModal, $ionicLoading, $ionicPopup, appService, CartService) {
        var vm = this;
        // sync form input to localstorage
        $localStorage.checkout = $localStorage.checkout || {};
        $scope.checkout = $localStorage.checkout;

        $rootScope.paymentAndShipping = $rootScope.paymentAndShipping || {};
        $rootScope.currency = $rootScope.currency || "USD";
        $scope.forms = {};
        $scope.checkout.personaInfo = 3;
        $scope.items = [];
        $scope.card = {};
        $scope.cart = {};

        $scope.$on('$ionicView.enter', function () {
            $scope.checkout.personaInfo = 3;

            // each view of cart tab, load the shopping cart and update with latest info
            $scope.loadCart();

            if ($state.is("app.menu.cart.checkout")) {
                $scope.loadPersonalInfo();
            } else if ($state.is("app.menu.cart.checkoutstep2")) {
                $scope.loadShippingMethods();
                $scope.loadPaymentMethods();
            } else if ($state.is("app.menu.cart.checkoutstep3")) {
                // loads the cart
            }
        });

        $scope.loadCart = function () {
            $ionicLoading.show();
           
            CartService.GetCart().then(function (data) {
                if (data && data.products && data.products.length < 1) {
                    $state.go('app.menu.cart.home', {}, { reload: true });
                }

                $rootScope.currency = data.currency;
                $scope.items = data.products;
                $scope.totals = data.totals;
                $scope.total_amount_clean = data.total_amount_clean;
                $scope.total_amount = data.total_amount;
                $rootScope.cartItemCount = parseInt(data.total_item_count);
                $scope._wpnonce = data._wpnonce;
                $scope.$broadcast('scroll.refreshComplete');
                $ionicLoading.hide();
            }, function (data) {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        // loads shipping methods to UI
        $scope.loadShippingMethods = function () {

            $rootScope.paymentAndShipping.shipping_method = null;

            CartService.GetShippingMethods().then(function (data) {
                $scope.shippingMethods = data.methods;
                $rootScope.paymentAndShipping = $rootScope.paymentAndShipping || {};
                $rootScope.paymentAndShipping.shipping_method = data.choosen_method;
            });
        }

        // loads payment methods to UI
        $scope.loadPaymentMethods = function () {
            $ionicLoading.show();

            /*CartService.GetCart().then(function (data) {
                if (data && data.products && data.products.length < 1) {
                    $state.go('app.menu.cart.home', {}, { reload: true });
                }

                $rootScope.currency = data.currency;
                $scope.items = data.products;
                $scope.totals = data.totals;
                $scope.total_amount_clean = data.total_amount_clean;
                $scope.total_amount = data.total_amount;
                $rootScope.cartItemCount = parseInt(data.total_item_count);
            });*/

            $rootScope.paymentAndShipping.payment_method = null;

            CartService.GetPaymentMethods().then(function (data) {
                $rootScope.paymentMethods = data.as_array;
                $rootScope.paymentMethodsSettings = data.settings;
                $ionicLoading.hide();
            }, function (data) {
                alert("Error while loading payment methods");
                $ionicLoading.hide();
            });
        }

        // loads user info to UI
        $scope.loadPersonalInfo = function () {
            // method depricated for woocommerce backend
        }

        // save personal info
        $scope.savePersonalInfo = function () {
            if ($scope.forms.checkoutForm.$invalid) {
                $ionicPopup.alert({
                    title: locale.getString('modals.registration_validations_title'),
                    cssClass: 'desc-popup',
                    scope: $scope,
                    templateUrl: 'app/cart/templates/popups/missing-step1.html'
                });
            } else {
                $ionicLoading.show();
                CartService.SetShippingAddress($scope.checkout).then(function (data) {
                    $scope.checkout.personaInfo = 0;
                });

                $ionicLoading.hide();
            }
        }

        // show invoice [last step before the order is added]
        $rootScope.loadInvoice = function () {
            if ($scope.forms.checkoutForm && $scope.forms.checkoutForm.$invalid) {
                $ionicPopup.alert({
                    title: locale.getString('modals.registration_validations_title'),
                    cssClass: 'desc-popup',
                    scope: $scope,
                    templateUrl: 'app/cart/templates/popups/missing-step2.html'
                });
            } else {
                // load invoice
                $state.go("app.menu.cart.checkoutstep3", {}, { reload: true });
            }
        };

        // method to be called when shipping method is changed by user
        $scope.shippingMethodChanged = function () {
            $ionicLoading.show();

            // save payment methods
            CartService.SaveShippingMethod($rootScope.paymentAndShipping).then(function (data) {
                $ionicLoading.hide();
                $scope.loadCart();
                $scope.loadPaymentMethods();
            }, function (data) {
                alert("Error while saving shipping method");
                $ionicLoading.hide();
            });

            $ionicLoading.hide();
        }

        // method to be called when payment method is changed by user
        $scope.paymentMethodChanged = function () {
            $ionicLoading.show();

            // save payment methods
            CartService.SavePaymentMethod($rootScope.paymentAndShipping).then(function (data) {
                $ionicLoading.hide();
                $scope.loadCart();
            }, function (data) {
                alert("Error while saving payment method");
                $ionicLoading.hide();
            });

            $ionicLoading.hide();
        }

        // method to be called when country is changed by user
        $scope.countryChanged = function () {
            $ionicLoading.show();
			$scope.states = false;
			$scope.checkout.state = "";
			CartService.LoadZones($scope.checkout.country_id).then(function(data){
				if(Object.keys(data).length !== 0){
					$scope.states = [];
					
					angular.forEach(data, function(v, k){
						$scope.states.push({state_id: k, name: v});
					});
				}
								
				$ionicLoading.hide();
			});
        }

        // place the order and if any payment module is registered, navigate to them
        $rootScope.confirmOrder = function () {
            if ($scope.forms.checkoutForm && $scope.forms.checkoutForm.$invalid) {
                $ionicPopup.alert({
                    title: locale.getString('modals.registration_validations_title'),
                    cssClass: 'desc-popup',
                    scope: $scope,
                    templateUrl: 'app/cart/templates/popups/missing-step2.html'
                });
            } else {
                
                var order = {};
                order['payment_method'] = $rootScope.paymentAndShipping.payment_method;
                order['shipping_method'] = $rootScope.paymentAndShipping.shipping_method;
                order['billing_first_name'] = $scope.checkout['firstname'];
                order['billing_last_name'] = $scope.checkout['lastname'];
                order['billing_company'] = "";
                order['billing_email'] = $scope.checkout['email'];
                order['billing_phone'] = $scope.checkout['telephone'];
                order['billing_country'] = $scope.checkout['country_id'];
                order['billing_address_1'] = $scope.checkout['address_1'];
                order['billing_address_2'] = $scope.checkout['address_2'];
                order['billing_city'] = $scope.checkout['city'];
                order['billing_state'] = $scope.checkout['state'];
                order['billing_postcode'] = $scope.checkout['postcode'];
                order['order_comments'] = $rootScope.paymentAndShipping['comment'];
                order['_wpnonce'] = $scope._wpnonce;

                if ($state.get("app.menu.payment_modules." + $rootScope.paymentAndShipping.payment_method + ".home")) {
                    $ionicLoading.hide();
                    $state.go("app.menu.payment_modules." + $rootScope.paymentAndShipping.payment_method + ".home", { checkout: order, currency: $rootScope.currency, total_amount: $scope.total_amount, total_amount_clean: $scope.total_amount_clean, success_state: "app.menu.cart.order_added" }, { reload: true });
                } else {
                    $ionicLoading.show();

                    CartService.AddOrder(order).then(function (data) {
                        $ionicLoading.hide();

                        // set cart badge to empty
                        $rootScope.cartItemCount = "";

                        var instructions = "";
                        if ($rootScope.paymentMethodsSettings[$rootScope.paymentAndShipping.payment_method]) {
                            instructions = $rootScope.paymentMethodsSettings[$rootScope.paymentAndShipping.payment_method].instructions;
                        }

                        $state.go("app.menu.cart.order_added", { instructions: instructions });
                    }, function (data) {
                        if (angular.isString(data)) {
                            alert(data);
                            $ionicLoading.hide();
                        } else if (data.status == "406") {
                            if (data.data && data.data.error && data.data.error.warning)
                                alert(data.data.error.warning);
                            $ionicLoading.hide();
                            if ($localStorage.login)
                                appService.Login($localStorage.login);
                        }

                        $ionicLoading.hide();
                    });
                }
            }
        };

        $scope.$watch('checkout.personaInfo', function (v) {
            if (v == 0) {
                $ionicLoading.hide();
                $state.go('app.menu.cart.checkoutstep2', {}, { reload: true });
            }
        });
    });

/**
* @ngdoc controller
* @name cart.module.controller:CartCheckoutSuccessCtrl
* @requires $scope
* @requires $stateParams
* @description
* Show success message after an order is added. Shows payment instructions.
*/
angular
    .module('cart.module')
    .controller('CartCheckoutSuccessCtrl', function ($scope, $stateParams) {
        $scope.instructions = $stateParams.instructions;
    });
