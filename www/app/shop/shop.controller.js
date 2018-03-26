'use strict';

/**
 * @ngdoc controller
 * @name shop.module.controller:ShopHomeCtrl
 * @requires $scope
 * @requires $localStorage
 * @requires $rootScope
 * @requires $stateParams
 * @requires $ionicSlideBoxDelegate
 * @requires ShopService
 * @description
 * Home page of the Shop module. This controller contains methods to show banners and product catalog in
 * the home page.
 */
angular
    .module('shop.module')
    .controller('ShopHomeCtrl', function ($scope, $localStorage, $rootScope, $stateParams, $ionicSlideBoxDelegate, ShopService, MAIN_PRMO_BANNER_ID, MAIN_OFFERS_BANNER_ID) {
        var vm = this;
        $scope.endOfRLatestItems = false;
        $scope.loadingLatest = false;

        // sync form input to localstorage
        $localStorage.home = {};
        $scope.data = {};
        $scope.slides = {};
        $scope.data.latestPage = 1;

        if (!$scope.slides)
            $scope.slides = [{ image: "app/shop/images/slide.png" }];

        $scope.refreshUI = function () {
            $scope.data.latestPage = 1;
            $scope.endOfRLatestItems = false;
            $scope.loadLatest(true);
            $scope.loadFeatured();
            $scope.loadBanners();
        }

        $scope.loadBanners = function () {
            ShopService.GetBannerById(MAIN_PRMO_BANNER_ID).then(function (data) {
                $scope.slides = data;
                $ionicSlideBoxDelegate.update();
            });

            ShopService.GetBannerById(MAIN_OFFERS_BANNER_ID).then(function (data) {
                $scope.offers = data;
                $ionicSlideBoxDelegate.update();
            });
        }

        $scope.loadFeatured = function () {
            ShopService.GetFeaturedProducts().then(function (data) {
                $scope.data.featuredItems = data;
                $ionicSlideBoxDelegate.update();
            });
        }

        $scope.loadLatest = function (refresh) {
            if ($scope.loadingLatest) {
                return;
            }

            $scope.loadingLatest = true;
            $scope.data.latestItems = $scope.data.latestItems || [];

            ShopService.GetLatestProducts($scope.data.latestPage).then(function (data) {
                if (refresh) {
                    $scope.data.latestItems = data;
                    $scope.data.latestPage = 1;
                } else {
                    if ($scope.data.latestPage == 1) {
                        $scope.data.latestItems = [];
                    }

                    $scope.data.latestItems = $scope.data.latestItems.concat(data);
                    $scope.data.latestPage++;
                }
                if (data && data.length < 1)
                    $scope.endOfRLatestItems = true;
                $scope.loadingLatest = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.refreshComplete');
            }, function (data) {
                $scope.loadingLatest = false;
                $scope.endOfRLatestItems = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        $scope.loadNextRecentPage = function () {
            if (!$scope.endOfRLatestItems) {
                $scope.loadLatest();
            } else {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.refreshComplete');
            }
        }

        $scope.loadFeatured();
        $scope.loadBanners();
    });


/**
 * @ngdoc controller
 * @name shop.module.controller:ShopItemCtrl
 * @requires $scope
 * @requires $timeout
 * @requires $localStorage
 * @requires $rootScope
 * @requires $state
 * @requires $stateParams
 * @requires $ionicPopup
 * @requires $ionicLoading
 * @requires $ionicTabsDelegate
 * @requires $ionicSlideBoxDelegate
 * @requires locale
 * @requires Slug
 * @requires ShopService
 * @requires CartService
 * @requires WEBSITE
 * @requires CURRENCY_SYMBOL
 * @description
 * Shows details of a selected item. Renders all attributes and options in the view.
 * Contains a `Buy` button which interacts with the API and add to product cart.
 */
angular
    .module('shop.module')
    .controller('ShopItemCtrl', function ($scope, $timeout, $localStorage, $rootScope, $state, $filter, $stateParams, $ionicPopup, $ionicLoading, $ionicTabsDelegate, $ionicSlideBoxDelegate, locale, Slug, ShopService, CartService, WEBSITE, CURRENCY_SYMBOL) {
        var vm = this;
        $scope.shop = {};
        $scope.cart = {};
        $scope.cart.quantity = 1;
        $scope.id = $stateParams.id;

        $scope.$on('$ionicView.enter', function () {
            $timeout(function () {
                $ionicTabsDelegate.$getByHandle('product-tabs').select(0);
            }, 0)
        });

        $localStorage.item_cache = $localStorage.item_cache || {};
        $scope.item_cache = $localStorage.item_cache;

        $ionicLoading.show();

        // check cache for the item. if item is available, immediately assign it
        if ($scope.item_cache.items && $scope.item_cache.items[$stateParams.id])
            $scope.item = $scope.item_cache.items[$stateParams.id];

        if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
                if (!$scope.item) {
                    alert(locale.getString('modals.error_not_connected_cache_failed'));
                } else {
                    alert(locale.getString('modals.error_not_connected_cache_success'));
                }

                $ionicLoading.hide();
            }
        }

        ShopService.GetProduct($stateParams.id).then(function (data) {
            $scope.item = {};

            $scope.permalink = data.permalink;
            $scope.item.name = data.name;
            $scope.item.product_id = data.id;
            $scope.item.text_stock = data.text_stock;
            $scope.item.text_model = data.sku || "#" + data.id;

            $scope.item.price = data.price_html;
            $scope.item.price_clear = data.price;
            $scope.item.special = data.special;
            $scope.item.description = data.description;
            $scope.item.off = data.off;
            $scope.item.mobile_special = data.mobile_special;
            $scope.item.stock = data.stock;
            $scope.item.model = data.model;

            $scope.item.options = data.type == "variable" ? data.attributes : [];

            // set specs values
            $scope.item.attribure_groups = [];
            $scope.item.attribure_groups[0] = { attribute: [] };

            for (var i in data.attributes) {
                $scope.item.attribure_groups[0].attribute.push({
                    name: data.attributes[i].name,
                    text: data.attributes[i].options.join(", ")
                });
            }

            $scope.item.minimum = data.minimum || 1;

            $scope.item.review_status = data.reviews_allowed;
            $scope.item.review_guest = data.reviews_allowed;
            $scope.item.rating = data.average_rating;
            $scope.item.entry_name = "Review";
            $scope.item.entry_review = "Review";

            //$scope.item.related = data.products;
            $scope.item.variations = data.variations;

            $scope.item.images = data.images;

            if (!$scope.item_cache.items)
                $scope.item_cache.items = {};
            $scope.item_cache.items[$stateParams.id] = $scope.item;

            //load related
            $scope.loadRelated(data.related_ids);

            $ionicSlideBoxDelegate.update();
            $timeout(function () {
                $ionicLoading.hide();
            }, 500);
        });

        // triggers when option dropdown is changed. if the product is having variations, we check
        // for correct variation here.
        $scope.optionChanged = function (id) {
            $scope.cart.variation = null;
            var nonSelectedOptions = false;
            for (var k in $scope.item.options) {
                if (!$scope.cart.options[k]) {
                    nonSelectedOptions = true;
                    break;
                }
            }

            for (var i in $scope.item.variations) {
                var brk = false;
                var el = $scope.item.variations[i];
                for (var k in el.attributes) {
                    var attr = el.attributes[k];
                    if ($scope.cart.variation || ($scope.cart.options[attr.id] != attr.option && attr.option != "")) {
                        brk = true;
                    }
                }

                if (!brk) {
                    $scope.cart.variation = el;
                    $scope.item.price = $filter('currency')(el.price, CURRENCY_SYMBOL);
                }
            }

            // if (!nonSelectedOptions && !$scope.cart.variation) {
            //     $scope.cart.options[id] = null;
            //     alert(locale.getString('shop.no_combinations_found'));
            // }
        }

        $scope.openRingSizeGuide = function () {

            $ionicPopup.alert({
                title: "Ring Size Guide",
                templateUrl: 'templates/popups/size_guide.html',
                scope: $scope
            });

            ShopService.GetRingSizeImage().then(function (data) {
                if (data && data.banners && data.banners[0])
                    $scope.item_cache.ringSizeUrl = data.banners[0].image;
            });
        }

        $scope.buyNow = function () {
            // add to cart and checkout
            if ($scope.shop.shopItemForm.$invalid) {
                $ionicPopup.alert({
                    title: locale.getString('shop.warning_options_missing'),
                    templateUrl: "app/shop/templates/popups/missing-props.html",
                    scope: $scope,
                    buttons: [
                        {
                            text: 'OK',
                            type: 'button-positive'
                        }
                    ]
                });
            } else {
                $ionicLoading.show();

                CartService.AddToCart($stateParams.id, $scope.cart.quantity, $scope.item, $scope.cart.variation).then(function (data) {
                    $rootScope.cartItemCount = $rootScope.cartItemCount || 0;
                    $rootScope.cartItemCount += parseInt($scope.cart.quantity);
                    $ionicTabsDelegate.select(2);
                    $state.go('app.menu.cart.home', {}, { reload: true });
                    $ionicLoading.hide();
                }, function (error) {
                    alert("Error. Can't add to the cart");
                    $ionicLoading.hide();
                });
            }
        }

        $scope.loadRelated = function(ids){
            $scope.item.related = [];
            angular.forEach(ids, function (el) {
                ShopService.GetProduct(el).then(function (data) {
                    $scope.item.related.push({
                        product_id: data.id,
                        name: data.name,
                        thumb: data.images && data.images[0] ? data.images[0].src : "",
                        price: data.price_html
                    });

                    $ionicSlideBoxDelegate.update();
                });
            })
        }

        $scope.addToCart = function () {
            if ($scope.shop.shopItemForm.$invalid) {
                $ionicPopup.alert({
                    title: 'Oops!',
                    templateUrl: "app/shop/templates/popups/missing-props.html",
                    scope: $scope,
                    buttons: [
                        {
                            text: 'OK',
                            type: 'button-positive'
                        }
                    ]
                });
            } else {

                // show alert regardless Add to cart confirmation
                var alertPopup = $ionicPopup.alert({
                    title: locale.getString('shop.added_to_cart_title'),
                    cssClass: 'desc-popup',
                    template: locale.getString('shop.added_to_cart_desc'),
                    buttons: [
                        { text: locale.getString('shop.button_shop_more') },
                        {
                            text: locale.getString('shop.button_go_to_cart'),
                            type: 'button-positive',
                            onTap: function (e) {
                                $ionicTabsDelegate.select(2);
                                $state.go('app.menu.cart.home', {}, { reload: true });
                            }
                        }
                    ]
                });

                CartService.AddToCart($stateParams.id, $scope.cart.quantity, $scope.item, $scope.cart.variation).then(function (data) {
                    $rootScope.cartItemCount = $rootScope.cartItemCount || 0;
                    $rootScope.cartItemCount += parseInt($scope.cart.quantity);
                }, function (error) {
                    alertPopup.close();
                    alert("Error");
                });
            }
        }

        $scope.share = function () {
            var link = $scope.permalink;
            window.plugins.socialsharing.share($scope.name, $scope.name, null, link);
        }

        $scope.range = function (min, max, step) {
            step = step || 1;
            min = min || 1;
            max = max || 10;
            min = parseInt(min);
            var input = [];
            for (var i = min; i <= max; i += step) {
                input.push(i);
            }

            return input;
        };

        $scope.selectableOptions = function (item) {
            return item.type === 'radio' || item.type === 'select';
        }

        $scope.multipleOptions = function (item) {
            return item.type === 'checkbox';
        }

        $scope.textOptions = function (item) {
            return item.type === 'text' || item.type === 'date' || item.type === 'time';
        }

        $scope.fileOptions = function (item) {
            return item.type === 'file';
        }

        $scope.datetimeOptions = function (item) {
            return item.type === 'datetime';
        }

        $scope.textareaOptions = function (item) {
            return item.type === 'textarea';
        }
    });


/**
 * @ngdoc controller
 * @name shop.module.controller:ShopCategoryCtrl
 * @requires $scope
 * @requires $rootScope
 * @requires $stateParams
 * @requires $state
 * @requires ShopService
 * @description
 * Lists products of a selected category.
 */
angular
    .module('shop.module')
    .controller('ShopCategoryCtrl', function ($scope, $rootScope, $stateParams, $state, ShopService) {
        var vm = this;

        $scope.id = $stateParams.id;

        if (!$stateParams.id) {
            $state.go('app.menu.shop.home');
        }

        $scope.endOfItems = false;
        $scope.loadingItems = false;
        $scope.page = 1;

        $scope.refreshUI = function () {
            $scope.endOfItems = false;
            $scope.items = [];
            $scope.page = 1;
            $scope.loadItems();
        }

        $scope.loadCategoryInformation = function () {
            ShopService.GetCategoryInformation($stateParams.id).then(function (data) {
                $scope.category_name = data.name;
            });
        }

        $scope.loadItems = function () {
            if ($scope.loadingItems) {
                return;
            }

            $scope.loadingItems = true;
            $scope.items = $scope.items || [];

            ShopService.GetCategoryProducts($stateParams.id, $scope.page).then(function (data) {
                $scope.items = $scope.items.concat(data);

                $scope.text_empty = data.text_empty;
                $scope.page++;
                if (data && data.length < 1)
                    $scope.endOfItems = true;
                $scope.loadingItems = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.refreshComplete');
            }, function (data) {
                $scope.loadingItems = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        $scope.loadNextPage = function () {
            if (!$scope.endOfItems) {
                $scope.loadItems();
            } else {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.refreshComplete');
            }
        }

        $scope.loadCategoryInformation();
    });


/**
 * @ngdoc controller
 * @name shop.module.controller:ShopSearchCtrl
 * @requires $scope
 * @requires $rootScope
 * @requires $ionicScrollDelegate
 * @requires $stateParams
 * @requires ShopService
 * @description
 * Search page shows a search input box and filters the product catalog for the customer entered
 * keywords.
 */
angular
    .module('shop.module')
    .controller('ShopSearchCtrl', function ($scope, $rootScope, $ionicScrollDelegate, $stateParams, ShopService) {

    });