'use strict';

/**
* @ngdoc service
* @name info.module.InfoService
* @requires ng.$q
* @requires $localStorage
* @requires dateService
* @description 
* This service class contains methods needed to show Order list and selected Order info of a logged in customer.
*/
angular
    .module('info.module')
    .service('InfoService', function ($q, $localStorage, dataService) {

        $localStorage.wishlist = $localStorage.wishlist || [];
        this.wishlist = $localStorage.wishlist;

        /**
         * @ngdoc function
         * @name info.module.InfoService#GetOrder
         * @methodOf info.module.InfoService
         * @kind function
         * 
         * @description
         * Gets order details identified by the id
         * 
         * @example
         <pre>
         InfoService.GetOrder(id).then(function (data) {
            $scope.order = data;
         });
         </pre>
         * 
         * @param {number} id Order id
         * @returns {promise} Returns a promise of the order
         */
        this.GetOrder = function (id) {

            return dataService.apiSecuredGet('/orders/' + id).then(function (data) {
                if (!data) {
                    return $q.reject(data);
                }

                return data;
            });
        }

        /**
        * @ngdoc function
        * @name info.module.InfoService#GetOrders
        * @methodOf info.module.InfoService
        * @kind function
        * 
        * @description
        * Gets order list of the logged in user
        * 
        * @example
         <pre>
         InfoService.GetOrders().then(function (data) {
            $scope.orders = data.orders;
         });
         </pre>
        * @returns {promise} Returns a promise of the order list
        */
        this.GetOrders = function () {

            return dataService.apiSecuredGet('/orders').then(function (data) {
                if (!data) {
                    return $q.reject(data);
                }

                var response = {};
                response.orders = data;
                return response;
            });
        }

        /**
        * @ngdoc function
        * @name info.module.InfoService#RemoveFromWishlist
        * @methodOf info.module.InfoService
        * @kind function
        * 
        * @description
        * Removes a product from the wishlist
        * 
        * @example
        <pre>
        InfoService.RemoveFromWishlist(46).then(function (data) {
               //success
        });
        </pre>
        * 
        * @param {number} id Product id
        * @returns {promise} Returns a promise of the API call.
        */
        this.RemoveFromWishlist = function (id) {
            if (this.wishlist) {
                var index = this.wishlist.indexOf(id);
                this.wishlist.splice(index, 1);

                return $q.resolve({});
            }

            return $q.reject({});
        }

        /**
         * @ngdoc function
         * @name info.module.InfoService#GetWishlist
         * @methodOf info.module.InfoService
         * @kind function
         * 
         * @description
         * Adds a product to the wishlist
         * 
         * @example
         <pre>
         InfoService.GetWishlist().then(function (data) {
                $scope.products = data.products;
         });
         </pre>
         * 
         * @returns {promise} Returns a promise of the API call.
         */
        this.GetWishlist = function () {
            var ids = this.wishlist.join(",");
            return dataService.apiSecuredGet('/products', { include: ids }).then(function (data) {
                return data;
            });
        }
    })