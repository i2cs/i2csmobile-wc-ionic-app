'use strict';

/**
* @ngdoc service
* @name starter.notificationService
* @requires $cordovaLocalNotification
* @requires $state
* @requires ONESIGNAL_APP_ID
* @requires GCM_SENDER_ID
* @description
* Initializes the notification service. This will register the device for push notifications.
*/
angular.module('starter')
    .service('notificationService', function ($cordovaLocalNotification, $state, ONESIGNAL_APP_ID, GCM_SENDER_ID) {

        /**
         * @ngdoc function
         * @name starter.notificationService#subscribeForPush
         * @methodOf starter.notificationService
         * @kind function
         * 
         * @description
         * Initializes the notification service. This will register the device for push notifications.
         *
         */
        this.subscribeForPush = function () {
            if (window.plugins && window.plugins.OneSignal) {

                var notificationOpenedCallback = function () { };

                var iosSettings = {};
                iosSettings["kOSSettingsKeyAutoPrompt"] = true;
                iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;

                window.plugins.OneSignal
                .startInit(ONESIGNAL_APP_ID, GCM_SENDER_ID)
                .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.None)
                .iOSSettings(iosSettings)
                .handleNotificationOpened(notificationOpenedCallback)
                .endInit();

                window.plugins.OneSignal.registerForPushNotifications();
                window.plugins.OneSignal.setSubscription(true);
            }
        }

        /**
         * @ngdoc function
         * @name starter.notificationService#unsubscribeFromPush
         * @methodOf starter.notificationService
         * @kind function
         * 
         * @description
         * Unsubscribes the device from push notifications and local notifications.
         *
         */
        this.unsubscribeFromPush = function () {
            if (window.plugins && window.plugins.OneSignal) {
                window.plugins.OneSignal.setSubscription(false);
            }
        }

        /**
        * @ngdoc function
        * @name starter.notificationService#init
        * @methodOf starter.notificationService
        * @kind function
        * 
        * @description
        * Do nothing
        *
        */
        this.init = function () {
        }
    });