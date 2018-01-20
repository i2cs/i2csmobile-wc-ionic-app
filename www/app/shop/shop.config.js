'use strict';

angular.module('shop.module')
    .config(function config($stateProvider) {
        $stateProvider
            .state('app.menu.shop', {
                url: '/shop',
                abstract: true,
                views: {
                    'tab-shop': {
                        templateUrl: 'app/shop/templates/layout.html'
                    },
                    'menu': {
                        templateUrl: 'app/shop/templates/layout.html'
                    }
                }
            })
        .state('app.menu.shop.home', {
            url: '/home',
            views: {
                'shopContent': {
                    templateUrl: 'app/shop/templates/shop-list.html',
                    controller: 'ShopHomeCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.menu.shop.item', {
            url: '/item/:id',
            views: {
                'shopContent': {
                    templateUrl: 'app/shop/templates/shop-item.html',
                    controller: 'ShopItemCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.menu.shop.search', {
            url: '/search',
            views: {
                'shopContent': {
                    templateUrl: 'app/shop/templates/shop-search.html',
                    controller: 'ShopSearchCtrl',
                    controllerAs: 'vm'
                }
            }
        })
        .state('app.menu.shop.category', {
            url: '/category/:id',
            views: {
                'shopContent': {
                    templateUrl: 'app/shop/templates/shop-category.html',
                    controller: 'ShopCategoryCtrl',
                    controllerAs: 'vm'
                }
            }
        })
    });


/**
* @ngdoc directive
* @name shop.module.directive:fileread
* @description
* Reads a file selected in a file input and add to the scope.
* @example
<pre>
<input type="file" fileread="cart.options[option.product_option_id]" >
</pre>
*/
angular.module('shop.module').directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);

/**
* @ngdoc directive
* @name shop.module.directive:filterBox
* @description
* Renders a search filter box.
* @example
<pre>
<filter-box placeholder="Search" filtertext="vm.search" ng-model-options="{debounce: 1000}"></filter-box>
</pre>
*/
angular.module('shop.module').directive('filterBox', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            model: '=?',
            search: '=?filtertext',
            change: '=?change'
        },
        link: function (scope, element, attrs) {
            attrs.minLength = attrs.minLength || 0;
            scope.placeholder = attrs.placeholder || '';
            scope.search = { value: '' };

            scope.clearSearch = function () {
                scope.search.value = "";
                scope.change();
            };
        },
        template: ' <div id="filter-box" class="item-input-inset">' +
                        '<div class="item-input-wrapper">' +
                            '<i class="icon ion-android-search"></i>' +
                            '<input type="search" placeholder="{{placeholder}}" style="width: 100%;" ng-model="search.value" ng-change="change()">' +
                        '</div>' +

                        '<button class="button button-clear ion-close button-small" style="color: #333" ng-if="search.value.length > 0" ng-click="clearSearch()">' +
                        '</button>' +
                    '</div>'
    };
})