'use strict';

/**
* @ngdoc service
* @name shop.module.ShopService
* @requires ng.$q
* @requires $localStorage
* @requires dateService
* @description 
* Service contains methods to communicate with the API. All methods returns a `promise` object containing 
* the requested data. On a success response it returns the data from the server, and on an error the promise 
* rejects with the HTTP server response.
* 
* Any request of listing products has following resolved Object
<pre>
[
        {
        "id": 93,
        "name": "Woo Single #1",
        "slug": "woo-single-1",
        "permalink": "http://localhost/wordpress/product/woo-single-1/",
        "date_created": "2013-06-07T11:36:34",
        "date_modified": "2013-06-07T11:36:34",
        "type": "simple",
        "status": "publish",
        "featured": false,
        "catalog_visibility": "visible",
        "description": "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>\n",
        "short_description": "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>\n",
        "sku": "",
        "price": "3",
        "regular_price": "3",
        "sale_price": "",
        "date_on_sale_from": "",
        "date_on_sale_to": "",
        "price_html": "<span class=\"woocommerce-Price-amount amount\"><span class=\"woocommerce-Price-currencySymbol\">&#36;</span>3.09</span>",
        "on_sale": false,
        "purchasable": true,
        "total_sales": 0,
        "virtual": false,
        "downloadable": true,
        "downloads": [],
        "download_limit": -1,
        "download_expiry": -1,
        "download_type": "standard",
        "external_url": "",
        "button_text": "",
        "tax_status": "taxable",
        "tax_class": "",
        "manage_stock": false,
        "stock_quantity": null,
        "in_stock": true,
        "backorders": "no",
        "backorders_allowed": false,
        "backordered": false,
        "sold_individually": false,
        "weight": "",
        "dimensions": {
            "length": "",
            "width": "",
            "height": ""
        },
        "shipping_required": true,
        "shipping_taxable": true,
        "shipping_class": "",
        "shipping_class_id": 0,
        "reviews_allowed": true,
        "average_rating": "0.00",
        "rating_count": 0,
        "related_ids": [
            90,
            83,
            99,
            87,
            96
        ],
        "upsell_ids": [],
        "cross_sell_ids": [],
        "parent_id": 0,
        "purchase_note": "",
        "categories": [
            {
            "id": 11,
            "name": "Music",
            "slug": "music"
            },
            {
            "id": 13,
            "name": "Singles",
            "slug": "singles"
            }
        ],
        "tags": [],
        "images": [
            {
            "id": 95,
            "date_created": "2013-06-07T11:36:22",
            "date_modified": "2013-06-07T11:36:22",
            "src": "http://localhost/wordpress/wp-content/uploads/2013/06/cd_4_angle.jpg",
            "shop_single": "http://localhost/wordpress/wp-content/uploads/2013/06/cd_4_angle-600x600.jpg",
            "shop_thumbnail": "http://localhost/wordpress/wp-content/uploads/2013/06/cd_4_angle-180x180.jpg",
            "name": "cd_4_angle",
            "alt": "",
            "position": 0
            },
            {
            "id": 94,
            "date_created": "2013-06-07T11:36:10",
            "date_modified": "2013-06-07T11:36:10",
            "src": "http://localhost/wordpress/wp-content/uploads/2013/06/cd_4_flat.jpg",
            "shop_single": "http://localhost/wordpress/wp-content/uploads/2013/06/cd_4_flat-600x600.jpg",
            "shop_thumbnail": "http://localhost/wordpress/wp-content/uploads/2013/06/cd_4_flat-180x180.jpg",
            "name": "cd_4_flat",
            "alt": "",
            "position": 1
            }
        ],
        "attributes": [],
        "default_attributes": [],
        "variations": [],
        "grouped_products": [],
        "menu_order": 0
        }
    ]
</pre>
*/
angular
    .module('shop.module')
    .service('ShopService', function ($q, $localStorage, dataService) {

        $localStorage.wishlist = $localStorage.wishlist || [];
        this.wishlist = $localStorage.wishlist;

        /**
         * @ngdoc function
         * @name shop.module.ShopService#GetBannerById
         * @methodOf shop.module.ShopService
         * @kind function
         * 
         * @description
         * Gets banner images by banner id
         * 
         * @example
         <pre>
         ShopService.GetBannerById(1).then(function (data) {
                $scope.data.slides = data.banners;
         });
         </pre>
         Resolved Object
         <pre>
         [{
                "title": "iPhone 6",
                "link": "#/app/menu/shop/item/24",
                "image": "full_image_path.jpg"
         }]
         </pre>
         * 
         * @param {number} banner_id Banner id
         * @returns {promise} Returns a promise of the API call.
         */
        this.GetBannerById = function (banner_id) {
            return dataService.apiSecuredGet('/store/banner', { id: banner_id }).then(function (data) {
                if (data) {
                    data = data.filter(function(a){
                        return a.image != "";
                    });

                    return data;
                } else {
                    return $q.reject(data);
                }
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.ShopService#GetCategories
         * @methodOf shop.module.ShopService
         * @kind function
         * 
         * @description
         * Gets all categories of the store
         * 
         * @example
         <pre>
         ShopService.GetCategories().then(function (data) {
                $scope.data.categories = data;
         });
         </pre>
         Resolved Object
         <pre>
         [
            {
            "id": 15,
            "name": "Albums",
            "slug": "albums",
            "parent": 11,
            "description": "",
            "display": "default",
            "image": [],
            "menu_order": 0,
            "count": 4
            }
         ]
         </pre>
         * @returns {promise} Returns a promise of the API call.
         */
        this.GetCategories = function (id) {
            return dataService.apiSecuredGet('/products/categories', {parent:id, per_page : 100 }).then(function (data) {

                for (var i in data) {
                    data[i].categories = [];
                    data[i].category_id = data[i].id;
                }

                var categories = {};
                categories.category_id = 0;
                categories.categories = data;

                return categories;
            })
        }

        /**
         * @ngdoc function
         * @name shop.module.ShopService#GetCategoryProducts
         * @methodOf shop.module.ShopService
         * @kind function
         * 
         * @description
         * Gets product list of a category
         * 
         * @example
         <pre>
         ShopService.GetCategoryProducts(1, 1).then(function (data) {
            $scope.items = data.products;
         });
         </pre>
         Resolved Object
         <pre>
         // mentioned in the service method description
         </pre>
         * 
         * 
         * @param {number} id Category id
         * @param {number} page Page number
         * @returns {promise} Returns a promise of the API call.
         */
        this.GetCategoryProducts = function (id, page) {
            return dataService.apiSecuredGet('/products', { category: id, page: page, per_page: 15, status: 'publish', orderby: 'date', order: 'desc' });
        }

        /**
         * @ngdoc function
         * @name shop.module.ShopService#GetCategoryInformation
         * @methodOf shop.module.ShopService
         * @kind function
         * 
         * @example
         * Resolved Object
         <pre>
         {
            "id": 15,
            "name": "Albums",
            "slug": "albums",
            "parent": 11,
            "description": "",
            "display": "default",

            "image": [],
            "menu_order": 0,
            "count": 4
          }
         </pre>
         *
         * @description
         * Gets information of a category. This method does not return product list of a catefory.
         */
        this.GetCategoryInformation = function (id) {
            return dataService.apiSecuredGet('/products/categories/' + id, {});
        }

        /**
         * @ngdoc function
         * @name shop.module.ShopService#GetProduct
         * @methodOf shop.module.ShopService
         * @kind function
         * 
         * @description
         * Gets details of a product by `id`
         * 
         * @example
         <pre>
         ShopService.GetProduct($stateParams.id).then(function (data) {
            $scope.item = data;
         });
         </pre>
         Resolved Object
         <pre>
         {
            "id": 99,
            "name": "Woo Single #2",
            "slug": "woo-single-2",
            "permalink": "http://localhost/wordpress/product/woo-single-2/",
            "date_created": "2013-06-07T11:38:12",
            "date_modified": "2016-08-02T07:10:03",
            "type": "variable",
            "status": "publish",
            "featured": false,
            "catalog_visibility": "visible",
            "description": "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>\n",
            "short_description": "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>\n",
            "sku": "",
            "price": "3",
            "regular_price": "",
            "sale_price": "",
            "date_on_sale_from": "",
            "date_on_sale_to": "",
            "price_html": "<span class=\"woocommerce-Price-amount amount\"><span class=\"woocommerce-Price-currencySymbol\">&#36;</span>3.09</span>&ndash;<span class=\"woocommerce-Price-amount amount\"><span class=\"woocommerce-Price-currencySymbol\">&#36;</span>6.18</span>",
            "on_sale": false,
            "purchasable": true,
            "total_sales": 31,
            "virtual": false,
            "downloadable": false,
            "downloads": [],
            "download_limit": -1,
            "download_expiry": -1,
            "download_type": "standard",
            "external_url": "",
            "button_text": "",
            "tax_status": "taxable",
            "tax_class": "",
            "manage_stock": false,
            "stock_quantity": null,
            "in_stock": true,
            "backorders": "no",
            "backorders_allowed": false,
            "backordered": false,
            "sold_individually": false,
            "weight": "",
            "dimensions": {
            "length": "",
            "width": "",
            "height": ""
            },
            "shipping_required": true,
            "shipping_taxable": true,
            "shipping_class": "",
            "shipping_class_id": 0,
            "reviews_allowed": true,
            "average_rating": "4.50",
            "rating_count": 2,
            "related_ids": [
            93,
            96,
            90,
            87,
            83
            ],
            "upsell_ids": [],
            "cross_sell_ids": [],
            "parent_id": 0,
            "purchase_note": "",
            "categories": [
            {
                "id": 11,
                "name": "Music",
                "slug": "music"
            },
            {
                "id": 13,
                "name": "Singles",
                "slug": "singles"
            }
            ],
            "tags": [],
            "images": [
            {
                "id": 100,
                "date_created": "2013-06-07T11:37:51",
                "date_modified": "2013-06-07T11:37:51",
                "src": "http://localhost/wordpress/wp-content/uploads/2013/06/cd_6_angle.jpg",
                "shop_single": "http://localhost/wordpress/wp-content/uploads/2013/06/cd_6_angle-600x600.jpg",
                "shop_thumbnail": "http://localhost/wordpress/wp-content/uploads/2013/06/cd_6_angle-180x180.jpg",
                "name": "cd_6_angle",
                "alt": "",
                "position": 0
            },
            {
                "id": 101,
                "date_created": "2013-06-07T11:38:03",
                "date_modified": "2013-06-07T11:38:03",
                "src": "http://localhost/wordpress/wp-content/uploads/2013/06/cd_6_flat.jpg",
                "shop_single": "http://localhost/wordpress/wp-content/uploads/2013/06/cd_6_flat-600x600.jpg",
                "shop_thumbnail": "http://localhost/wordpress/wp-content/uploads/2013/06/cd_6_flat-180x180.jpg",
                "name": "cd_6_flat",
                "alt": "",
                "position": 1
            }
            ],
            "attributes": [
            {
                "id": 1,
                "name": "color",
                "position": 0,
                "visible": true,
                "variation": true,
                "options": [
                "Black",
                "Green",
                "Light Blue @"
                ]
            },
            {
                "id": 2,
                "name": "input something",
                "position": 1,
                "visible": true,
                "variation": true,
                "options": [
                "d",
                "sd"
                ]
            }
            ],
            "default_attributes": [
            {
                "id": 1,
                "name": "color",
                "option": "black"
            },
            {
                "id": 2,
                "name": "input something",
                "option": "d"
            }
            ],
            "variations": [
            {
                "id": 103,
                "date_created": "2016-08-02T06:59:48",
                "date_modified": "2016-08-02T07:16:27",
                "permalink": "http://localhost/wordpress/product/woo-single-2/?attribute_pa_color=green&attribute_pa_input=sd",
                "sku": "",
                "price": "4",
                "regular_price": "4",
                "sale_price": "",
                "date_on_sale_from": "",
                "date_on_sale_to": "",
                "on_sale": false,
                "purchasable": true,
                "visible": true,
                "virtual": false,
                "downloadable": false,
                "downloads": [],
                "download_limit": -1,
                "download_expiry": -1,
                "tax_status": "taxable",
                "tax_class": "",
                "manage_stock": false,
                "stock_quantity": null,
                "in_stock": true,
                "backorders": "no",
                "backorders_allowed": false,
                "backordered": false,
                "weight": "",
                "dimensions": {
                "length": "",
                "width": "",
                "height": ""
                },
                "shipping_class": "",
                "shipping_class_id": 0,
                "image": [
                {
                    "id": 100,
                    "date_created": "2013-06-07T11:37:51",
                    "date_modified": "2013-06-07T11:37:51",
                    "src": "http://localhost/wordpress/wp-content/uploads/2013/06/cd_6_angle.jpg",
                    "shop_single": "http://localhost/wordpress/wp-content/uploads/2013/06/cd_6_angle-600x600.jpg",
                    "shop_thumbnail": "http://localhost/wordpress/wp-content/uploads/2013/06/cd_6_angle-180x180.jpg",
                    "name": "cd_6_angle",
                    "alt": "",
                    "position": 0
                }
                ],
                "attributes": [
                {
                    "id": 1,
                    "name": "color",
                    "option": "green"
                },
                {
                    "id": 2,
                    "name": "input something",
                    "option": "sd"
                }
                ]
            }
            ],
            "grouped_products": [],
            "menu_order": 0
        }
         </pre>
         * 
         * @param {number} id Product id
         * @returns {promise} Returns a promise of the API call.
         */
        this.GetProduct = function (id) {
            return dataService.apiSecuredGet('/products/' + id).then(function (data) {
                return data;
            });
        }

        /**
        * @ngdoc function
        * @name shop.module.ShopService#GetProductReviews
        * @methodOf shop.module.ShopService
        * @kind function
        * 
        * @description
        * Get a list of customer reviews of a product
        * 
        * @example
        <pre>
        ShopService.GetProductReviews($scope.item.product_id, $scope.page).then(function (data) {
           $scope.reviews = data;
        });
        </pre>
        Resolved Object
        <pre>
        [
		  {
			"id": 40,
			"date_created": "2013-06-07T11:58:43",
			"review": "This album proves why The Woo are the best band ever. Best music ever!",
			"rating": 4,
			"name": "Cobus Bester",
			"email": "bester.c@gmail.com",
			"verified": false
		  }
		]
        </pre>
        * 
        * @param {number} id Product id
        * @param {number} page Page number
        * @returns {promise} Returns a promise of the API call.
        */
        this.GetProductReviews = function (id, page) {
            return dataService.apiSecuredGet('/products/' + id + '/reviews', { page: page || 1 });
        }

        /**
        * @ngdoc function
        * @name shop.module.ShopService#AddProductReview
        * @methodOf shop.module.ShopService
        * @kind function
        * 
        * @description
        * Posts a review to a product
        * 
        * @example
        <pre>
        ShopService.AddProductReview(id, rating, text, author, email).then(function (data) {
           $scope.review = data;
        });
        </pre>
        Resolved Object
        <pre>
        [
          {
            "id": 40,
            "date_created": "2013-06-07T11:58:43",
            "review": "This album proves why The Woo are the best band ever. Best music ever!",
            "rating": 4,
            "name": "Cobus Bester",
            "email": "bester.c@gmail.com",
            "verified": false
          }
        ]
        </pre>
        * 
        * @param {number} product_id Product id
        * @param {string} name Reviewer name
        * @param {number} rating Rating
        * @param {string} text User review text
		* @param {string} author Author name (required if not logged in)
		* @param {string} email Author email (required if not logged in)
        * 
        * @returns {promise} Returns a promise of the API call.
        */
        this.AddProductReview = function (id, rating, text, author, email) {
            return dataService.apiSecuredPost('/products/' + id + '/reviews', { rating: rating, comment: text, author: author, email: email }).then(function (data) {
                if (!data || data.id === 0) {
                    return $q.reject(data);
                }

                if (angular.isString(data)) {
                    return $q.reject(data);
                }

                if (data && data.message) {
                    return $q.reject(data.message);
                }

                return data;
            }, function (data) {
                return $q.reject(data.data);
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.ShopService#GetRingSizeImage
         * @methodOf shop.module.ShopService
         * @kind function
         * 
         * @description
         * Gets ring size guid image. This is a sample service call to retrieve a banner by `id`
         * 
         * @returns {promise} Returns a promise of the API call.
         */
        this.GetRingSizeImage = function () {
            return dataService.apiSecuredPost('/store/banner', { id: 116 }).then(function (data) {
                if (data.banners) {
                    return data;
                } else {
                    return $q.reject(data);
                }
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.ShopService#GetFeaturedProducts
         * @methodOf shop.module.ShopService
         * @kind function
         * 
         * @description
         * Gets featured products list.
         * 
         * @example
         <pre>
         ShopService.GetFeaturedProducts().then(function (data) {
                $scope.data.featuredItems = data;
         });
         </pre>
         Resolved Object
         <pre>
         // mentioned in the service method description
         </pre>
         * 
         * @returns {promise} Returns a promise of the API call.
         */
        this.GetFeaturedProducts = function () {
            return dataService.apiSecuredGet('/products', { featured: true, per_page: 5, status: 'publish', orderby: 'date', order: 'desc' }).then(function (data) {
                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.ShopService#GetLatestProducts
         * @methodOf shop.module.ShopService
         * @kind function
         * 
         * @description
         * Gets latest products list
         * 
         * @example
         <pre>
         ShopService.GetLatestProducts($scope.data.latestPage).then(function (data) {
            $scope.data.latestItems = data;
         });
         </pre>
         Resolved Object
         <pre>
          // mentioned in the service method description
         </pre>
         * 
         * @param {number} page Page number
         * @returns {promise} Returns a promise of the API call.
         */
        this.GetLatestProducts = function (page) {
            return dataService.apiSecuredGet('/products', { page: page, per_page: 15, status: 'publish', orderby: 'date', order: 'desc' }).then(function (data) {
                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.ShopService#SearchProducts
         * @methodOf shop.module.ShopService
         * @kind function
         * 
         * @description
         * Search for products by a given search term
         * 
         * @example
         <pre>
         ShopService.SearchProducts(vm.search.value, $scope.page).then(function (data) {
            $scope.items = data;
         });
         </pre>
         Resolved Object
         <pre>
         // mentioned in the service method description
         </pre>
         * 
         * @param {string} search Search term
         * @param {number} page Page number
         * @returns {promise} Returns a promise of the API call.
         */
        this.SearchProducts = function (search, page) {
            var limit = 10;
            return dataService.apiSecuredGet('/products/search', { term: search, page: page, limit: limit }).then(function (data) {
                return data;
            });
        }

        /**
         * @ngdoc function
         * @name shop.module.ShopService#AddToWishlist
         * @methodOf shop.module.ShopService
         * @kind function
         * 
         * @description
         * Adds a product to the wishlist
         * 
         * @example
         <pre>
         ShopService.AddToWishlist(46).then(function (data) {
                //success
         });
         </pre>
         * 
         * @param {number} id Product id
         * @returns {promise} Returns a promise of the API call.
         */
        this.AddToWishlist = function (id) {
            if (this.wishlist) {
                this.wishlist.push(id);
                return $q.resolve({ success : 1 });
            } else {
                this.wishlist = [];
                this.wishlist.push(id);
                return $q.resolve({ success: 1 });
            }
        }
    })