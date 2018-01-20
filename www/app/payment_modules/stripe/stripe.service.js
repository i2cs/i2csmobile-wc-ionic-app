(function () {
    'use strict';
    angular
        .module('stripe.module')
        .service('PaymentStripeService', function ($http, $q, dataService) {

            this.GetConfig = function () {
                return dataService.apiSecuredGet('/cart/payment').then(function (data) {
                    if (!data || !data.stripe)
                        return $q.reject("Module not found. Check if it's enabled from Woocommerce");
                    else
                        return data.stripe;
                });
            }
        })
})();