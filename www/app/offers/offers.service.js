'use strict';

/**
* @ngdoc service
* @name offers.module.OffersService
* @requires ng.$q
* @requires dateService
* @description 
* This service class contains methods needed to show Order list and selected Order info of a logged in customer.
*/
angular
    .module('offers.module')
    .service('OffersService', function ($q, dataService) {

        /**
         * @ngdoc function
         * @name offers.module.OffersService#GetOfferBanners
         * @methodOf offers.module.OffersService
         * @kind function
         * 
         * @description
         * Gets offers banner configured in the API
         * 
         * @example
         <pre>
         OffersService.GetOfferBanners().then(function (data) {
                $scope.data.slides = data.banners;
         });
         </pre>
         Resolved Object
         <pre>
         {
            "banners": [{
                "title": "iPhone 6",
                "link": "#/app/menu/shop/item/24",
                "image": "full_image_path.jpg"
            }]
         }
         </pre>
         * 
         * @returns {promise} Returns a promise of the API call.
         */
        this.GetOfferBanners = function (id) {
            return dataService.apiSecuredGet('/store/banner', { id: id });
        }

        /**
         * @ngdoc function
         * @name offers.module.OffersService#GetLatestProducts
         * @methodOf offers.module.OffersService
         * @kind function
         * 
         * @description
         * Gets items with special offers
         * 
         * @example
         * Resolved Object
         <pre>
         {
          "heading_title": "Special Offers",
          "text_empty": "There are no special offer products to list.",
          "products": [
            {
              "product_id": "43",
              "thumb": "full_image_path200x200.jpg",
              "name": "MacBook",
              "description": "description",
              "price": "$602.00",
              "price_clear": "500.0000",
              "special": false,
              "special_clear": null,
              "mobile_special": "$26.00",
              "mobile_special_clear": "20.0000",
              "off":"20",
              "tax": "$500.00",
              "rating": 0,
              "images": [
                "full_image_path100x100.jpg",
                "full_image_path100x100.jpg",
                "full_image_path100x100.jpg"
              ]
            }
          ]
        }
         </pre>
         * 
         * @param {number} page Page number
         * @returns {promise} Returns a promise of the API call.
         */
        this.GetSpecialProducts = function (page) {

            return dataService.apiSecuredGet('/products', { sale: true, page: page, per_page: 15 }).then(function (data) {
                return data;
            });
        }
    })
