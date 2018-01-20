'use strict';

angular.module('paypal.module')
    .config(function config($stateProvider) {
        $stateProvider.state('app.menu.payment_modules.paypal', {
            url: '/paypal',
               abstract: true,
               views: {
                   'paymentsContent': {
                       templateUrl: 'app/payment_modules/paypal/templates/layout.html'
                   }
               }
           })
           .state('app.menu.payment_modules.paypal.home', {
               url: '/home',
               views: {
                   'ppExpressContent': {
                       templateUrl: 'app/payment_modules/paypal/templates/home.html',
                       controller: 'PaymentPaypalCtrl'
                   }
               }
           })
    });