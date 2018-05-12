'use strict';

angular.module('myfatoorah.module')
    .config(function config($stateProvider) {
        $stateProvider.state('app.menu.payment_modules.myfatoorah', {
            url: '/myfatoorah',
               abstract: true,
               views: {
                   'paymentsContent': {
                       templateUrl: 'app/payment_modules/myfatoorah/templates/layout.html'
                   }
               }
           })
           .state('app.menu.payment_modules.myfatoorah.home', {
               url: '/home',
               views: {
                   'myfatoorahContent': {
                       templateUrl: 'app/payment_modules/myfatoorah/templates/home.html',
                       controller: 'PaymentmyfatoorahCtrl'
                   }
               }
           })
    });