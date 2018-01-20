'use strict';

/**
* @ngdoc overview
* @name payments.module
* @requires ui.router
* @description
* Payments module registeres payment method modules as dependencies. If a new payment method
* module is introduced, you have to register it as a dependency.
* 
* @example
``` 
angular.module('payments.module', ['ui.router', 'stripe.module']);
```
*
**/
angular.module('payments.module', ['ui.router', 'stripe.module', 'paypal.module']);