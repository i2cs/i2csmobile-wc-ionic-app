'use strict';

/**
* @ngdoc service
* @name starter.dataService
* @requires ng.$http
* @requires ng.$q
* @requires starter.BASE_API_URL
* @description
* Calls the http API endpoints and resolves the response. The `dataService` is responsible for providing a `promise` object containing 
the requested data. On a success response it returns the data from the server, and on an error the promise rejects 
with the HTTP server response. i.e, HTTP server response object contains,

```
config:Object
data:Object
headers:function(c)
status:406
statusText:"Not Acceptable"
```
*/
angular.module('starter')
    .service('dataService', function ($http, $q, $httpParamSerializerJQLike, BASE_API_URL) {

        /**
         * @ngdoc function
         * @name starter.dataService#apiSecuredPost
         * @methodOf starter.dataService
         * @kind function
         * 
         * @description
         * Calls the http API POST endpoints and resolves the response
         * 
         * @example
         <pre>
         this.PostSomething = function () {
             return dataService.apiSecuredPost('/ctrl/sample', {param1 : 'value'});
         }
         </pre>
         or
         <pre>
         this.PostSomething = function () {
             return dataService.apiSecuredPost('/ctrl/sample', {param1 : 'value'}).then(function(data){
                // success
             }, function(data){
                // error
             })
         }
         </pre>
         * @param {string} url Relative URL of the API endpoint. Ex "/layout/banners"
         * @param {object} data Data to be sent via Http post params
         * @returns {promise} Returns a promise of the API call.
         */
        this.apiSecuredPost = function (url, data) {
            var that = this;
            if (!data)
                data = {}

            // last post item is ommited from emulator [bug]
            data.zzz_fix = 1;

            var config = {};
            config.headers = [];
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            
            return $http.post(BASE_API_URL + url, $httpParamSerializerJQLike(data), config).then(function (response) {

                if (!response || response.status == 401 || response.status == 500)
                    return $q.reject(response);

                return response && response.data ? response.data : {};
            }, function (response) {
                return response && response.data ? $q.reject(response) : {};
            });
        };

        /**
         * @ngdoc function
         * @name starter.dataService#apiSecuredGet
         * @methodOf starter.dataService
         * @kind function
         * 
         * @description
         * Calls the http GET API endpoints and resolves the response
         * 
         * @example
         <pre>
         this.GetSomething = function () {
             return dataService.apiSecuredGet('/ctrl/sample', {param1 : 'value'});
         }
         </pre>
         or
         <pre>
         this.GetSomething = function () {
             return dataService.apiSecuredGet('/ctrl/sample', {param1 : 'value'}).then(function(data){
                // success
             }, function(data){
                // error
             })
         }
         </pre>
         * @param {string} url Relative URL of the API endpoint. Ex "/layout/banners"
         * @param {object} data Data to be sent via Http get params
         * @returns {promise} Returns a promise of the API call.
         */
        this.apiSecuredGet = function (url, data) {
            var that = this;
            if (!data)
                data = {}

            var config = {};
            config.headers = [];
            config.headers['Content-Type'] = 'application/json; charset=UTF-8';

            config.params = data;
            
            return $http.get(BASE_API_URL + url, config).then(function (response) {

                if (!response || response.status == 401 || response.status == 500)
                    return $q.reject(response);

                return response && response.data ? response.data : {};
            }, function (response) {
                return response && response.data ? $q.reject(response) : {};
            });
        };
    });