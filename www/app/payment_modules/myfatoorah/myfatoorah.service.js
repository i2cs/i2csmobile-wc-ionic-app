(function () {
    'use strict';
    angular
        .module('myfatoorah.module')
        .service('PaymentmyfatoorahService', function ($http, $q, $ionicLoading, dataService, BASE_URL) {

            this.OpenPaymetWindow = function (url) {
                var deferred = $q.defer();

                if (cordova && cordova.InAppBrowser) {
                    $ionicLoading.show();

                    var inappbrowser = cordova.InAppBrowser.open(url, '_blank', 'hidden=yes');
                    inappbrowser.addEventListener('loadstop', function (e) {
                        inappbrowser.show();
                        $ionicLoading.hide();
                        try {

                            if (e.url.substring(0, BASE_URL.length) === BASE_URL) {
                                if (e.url.indexOf("order-received") > -1) {
                                    var id = getParameterByName("key", e.url);
                                    deferred.resolve({ response: "success", order_id: id });
                                    inappbrowser.close();
                                } else if ("true" == getParameterByName("cancel_order", e.url)) {
                                    deferred.reject({ error: "Payment terminated" });
                                    inappbrowser.close();
                                }
                            }
                        } catch (e) {

                        }
                    });
                } else {
                    deferred.reject({ error: "No inAppBrowser" });
                }

                return deferred.promise;
            }

            var getParameterByName = function (name, url) {
                if (!url) url = window.location.href;
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            }

        })
})();