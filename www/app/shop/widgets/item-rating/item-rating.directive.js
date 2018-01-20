'use strict';

/**
* @ngdoc directive
* @name shop.module.directive:itemRating
* @description
* Widget to render product reviews list and add new review sections. 
* @example
<pre>
    <item-rating item="item"></item-rating>
</pre>
*/
angular.module('shop.module')
   .directive('itemRating', function ($ionicLoading) {
       return {
           scope: {
               item: "=item"
           },
           link: function (scope, element, attrs) {
               if (scope.item && scope.item.review_status)
                   scope.loadReviews(1);

               scope.ratingsSettings = {
                   iconOn: 'ion-ios-star',
                   iconOff: 'ion-ios-star-outline',
                   iconOnColor: '#387ef5',
                   iconOffColor: '#387ef5',
                   readOnly: false,
                   rating: parseInt(scope.item.rating),
                   callback: function (rating) {
                       scope.ratingsCallback(rating);
                   }
               };
           },
           controller: ['$scope', '$rootScope', 'ShopService', function ($scope, $rootScope, ShopService) {
               $scope.reviews = [];
               $scope.page = 1;
               $scope.rating = 0;
               $scope.review = {};
               $scope.review_added = false;
               $scope.success_message = "";

               $scope.loadReviews = function (page, append) {
                   //$ionicLoading.show();
                   ShopService.GetProductReviews($scope.item.product_id, page).then(function (data) {
                       $scope.page = page;

                       if (append) {
                           $scope.reviews = $scope.reviews.concat(data);
                       } else {
                           $scope.reviews = data;
                       }

                       //$ionicLoading.hide();
                   }, function () {
                       //$ionicLoading.hide();
                   });
               }

               $scope.postReview = function () {
                   if ($scope.rating == 0) {
                       alert("Please mark your rating");
                       return;
                   }

                   $ionicLoading.show();

                   ShopService.AddProductReview($scope.item.product_id, $scope.rating, $scope.review.text, $scope.review.author, $scope.review.email).then(function (data) {
                       alert("Review added and pending for approval");
                       $scope.success_message = "Review added and pending for approval";
                       $scope.review_added = true;

                       $ionicLoading.hide();
                   }, function (data) {
                       if(angular.isString(data))
                           data(data)
                       else if (data && data.message)
                           alert(data.message);
                       else
                           alert("Error occured while adding the review")
                       $ionicLoading.hide();
                       $scope.forced_to_enter_author_details = true;
                   });
               }

               $scope.loadNextPage = function () {
                   var p = $scope.page + 1;
                   $scope.loadReviews(p, true);
               }

               $scope.ratingsCallback = function (rating) {
                   $scope.rating = rating;
               };

               $scope.userLoggedIn = function () {
                   return $rootScope.userLoggedIn();
               }
           }],
           templateUrl: 'app/shop/widgets/item-rating/reviews-template.html'
       };
   });