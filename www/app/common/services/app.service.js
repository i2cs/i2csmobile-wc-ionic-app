'use strict';

/**
* @ngdoc service
* @name starter.appService
* @requires ng.$q
* @requires dateService
* @description Contains service methods related to customer login and registration
*/
angular.module('starter')
    .service('appService', function ($q, dataService) {
        /**
         * @ngdoc function
         * @name starter.appService#Register
         * @methodOf starter.appService
         * @kind function
         * 
         * @description
         * Registers a new user
         * 
         * @param {object} register Registration information
         * @param {string} register.firstname Customers first name. must be between 1 and 32 characters
         * @param {string} register.lastname Customers last name. must be between 1 and 32 characters
         * @param {email} register.email Customers email address. must be a valid email address
         * @param {string} register.password Password. must be between 4 and 20 characters
         * @param {string} register.confirm Password confirmation. should be same as the password
         * @param {string} register.telephone Customers telephone number. must be between 3 and 32 characters
         * @param {string} register.address_1 Address line 1. must be between 3 and 128 characters
         * @param {string=} register.address_2 Address line 2
         * @param {string} register.city Address City. must be between 2 and 128 characters
         * @param {string} register.postcode Postal code
         * @param {number} register.country Country code
         * @param {string} register.state Zone or State
         * @param {boolean=} register.newsletter Sign up for newsletters
         * 
         * @returns {promise} Promise of the API call
         */
        this.Register = function (register) {
            register.first_name = register.firstname;
            register.last_name = register.lastname;

            register.username = register.email;
            register.billing = {};
            register.billing.first_name = register.first_name;
            register.billing.last_name = register.last_name;
            register.billing.address_1 = register.address_1;
            register.billing.address_2 = register.address_2;
            register.billing.city = register.city;
            register.billing.postcode = register.postcode;
            register.billing.state = register.state;
            register.billing.country = register.country;
            register.billing.email = register.email;
            register.billing.phone = register.telephone;

            register.shipping = register.billing;


            return dataService.apiSecuredPost('/customers', register).then(function (data) {
                data.customer_id = data.id;
                data.firstname = data.first_name;
                data.lastname = data.last_name;

                return data;
            }, function (data) {
                return $q.reject(data.data);
            });
        }

        /**
         * @ngdoc function
         * @name starter.appService#Login
         * @methodOf starter.appService
         * @kind function
         * 
         * @description
         * Logs in a user
         * @param {object} login Object containing login data
         * @param {string} login.username Customers email address. must be a valid email address
         * @param {string} login.password Password. must be between 4 and 20 characters and must match with the account of the email address provided
         * 
         * @returns {promise} Promise of the API call
         */
        this.Login = function (login) {
            return dataService.apiSecuredPost('/customers/login', login).then(function (data) {
                data.customer_id = data.id;
                data.firstname = data.first_name;
                data.lastname = data.last_name;
                
                return data;
            }, function (data) {
                return $q.reject(data.data);
            });
        }

        /**
         * @ngdoc function
         * @name starter.appService#Logout
         * @methodOf starter.appService
         * @kind function
         * 
         * @description
         * Logout current session from API
         * @returns {promise} Promise of the API call
         */
        this.Logout = function () {
            return dataService.apiSecuredPost('/customers/logout');
        }

        /**
        * @ngdoc function
        * @name starter.appService#SetLanguage
        * @methodOf starter.appService
        * @kind function
        * 
        * @param {string} lang Language code Ex. `en-US`
        * 
        * @description
        * Sets language of the Woocommerce system to given locale. code parameter is expected in ISO standard language code, ex `en-US`
        * 3rd party plugins needed in woocommerce, this needs code editing in `class-wc-rest-i2cs-store-controller.php`
        * @returns {promise} Returns a promise
        */
        this.SetLanguage = function (lang) {
            if (!angular.isString(lang) || lang.length < 5) {
                lang = "en-US";
            }

            lang = lang.trim();
            var i = lang.split("-");
            if (i.length > 1 && angular.isString(i[0]) && i[0].length)
                return dataService.apiSecuredPost('/store/language', { language: i[0].toLowerCase() });


            return $q.reject({ error: "invalid language code : " + lang });
        }

        /**
        * @ngdoc function
        * @name starter.appService#GetCountries
        * @methodOf starter.appService
        * @kind function
        * 
        * @param {boolean} shipping Whether to load countries where shipping is enabled
        * 
        * @description
        * Loads countries allowed in the woo backend. If shipping flag is set to true, shipping enabled countries are returned.
        * @returns {promise} Returns a promise
        */
        this.GetCountries = function (shipping) {
            return dataService.apiSecuredGet('/store/countries', { shipping : shipping || "false"}).then(function (data) {
                return data;
            }, function (data) {
                return $q.reject(data.data);
            });
        }
    })