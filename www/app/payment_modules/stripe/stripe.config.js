'use strict';

angular.module('stripe.module')
    .config(function config($stateProvider, StripeCheckoutProvider) {
        $stateProvider.state('app.menu.payment_modules.stripe', {
            url: '/stripe',
               abstract: true,
               resolve: {
                   // checkout.js isn't fetched until this is resolved.
                   stripe: StripeCheckoutProvider.load
               },
               views: {
                   'paymentsContent': {
                       templateUrl: 'app/payment_modules/stripe/templates/layout.html'
                   }
               }
           })
           .state('app.menu.payment_modules.stripe.home', {
               url: '/home',
               views: {
                   'stripeContent': {
                       templateUrl: 'app/payment_modules/stripe/templates/home.html',
                       controller: 'PaymentStripeCtrl',
                       controllerAs: 'vm'
                   }
               }
           })
    });