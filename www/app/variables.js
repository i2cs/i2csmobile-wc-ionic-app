angular.module('starter')
    //.constant('BASE_URL', 'http://localhost/wordpress')
    //.constant('BASE_API_URL', 'http://localhost/wordpress/wp-json/i2cs/v1')

    .constant('BASE_URL', 'http://saasthara.com/i2cs/shops/woocommerce/')
    .constant('BASE_API_URL', 'http://saasthara.com/i2cs/shops/woocommerce/wp-json/i2cs/v1')

    .constant('WEBSITE', 'http://saasthara.com/i2cs/shops/woocommerce/')
    .constant('FORGOT_LINK', 'http://saasthara.com/i2cs/shops/woocommerce/my-account/lost-password/')
    .constant('EMAIL', 'i2cssolutions@gmail.com')
    .constant('PHONE', '0712966650')
    .constant('ANALYTICS_ID', 'UA-79548648-1')
    .constant('COUPONS_ENABLED', true)
    .constant('STATUSBAR_COLOR', "#387ef5")
	.constant('LANGUAGES', [
            { name: "English", language_id: "en-US" },
            { name: "French", language_id: "fr-FR" },
            { name: "Chinese", language_id: "zh-CN" },
	        { name: "Arabic", language_id: "ar-EG" }])
    .constant('WELCOME_SLIDES', [])
    .constant('RTL_LANGUAGES', ['ar'])
    .constant('CURRENCY_SYMBOL', 'د.ك')
    .constant('DATE_FORMAT', "MM/dd/yyyy h:mma")
    .constant('MAIN_PRMO_BANNER_ID', 112)
    .constant('MAIN_OFFERS_BANNER_ID', 103)
    .constant('OFFERS_PAGE_BANNER_ID', 103)
    .constant('INTERCOM_INTEGRATION', false) // please check www/app/common/services/intercom.service.js
    .constant('ONESIGNAL_APP_ID', "9302072d-783a-41f4-b3dc-80359f64ef96") // get OneSignal app id from http://onesignal.com
    .constant('GCM_SENDER_ID', "1037766790597")
    .constant('MENU_LAYOUT', "tabs")

    // if demo mode is set to true, some dynamic configurations 
    // used only for demo app will appear in info section
    .constant('DEMO_MODE', false)