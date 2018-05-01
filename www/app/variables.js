angular.module('starter')
    //.constant('BASE_URL', 'http://localhost/wordpress')
    //.constant('BASE_API_URL', 'http://localhost/wordpress/wp-json/i2cs/v1')

    .constant('BASE_URL', 'https://ishkhasran.com/i2cs/shops/woocommerce/')
    .constant('BASE_API_URL', 'https://ishkhasran.com/wp-json/i2cs/v1')

    .constant('WEBSITE', 'https://ishkhasran.com')
    .constant('FORGOT_LINK', 'https://ishkhasran.com/my-account/lost-password/')
    .constant('EMAIL', 'i2cssolutions@gmail.com')
    .constant('PHONE', '0712966650')
    .constant('ANALYTICS_ID', 'UA-79548648-1')
    .constant('COUPONS_ENABLED', true)
    .constant('STATUSBAR_COLOR', "#387ef5")
	.constant('LANGUAGES', [
	        { name: "Arabic", language_id: "ar-EG" }])
    .constant('WELCOME_SLIDES', [])
    .constant('RTL_LANGUAGES', ['ar'])
    .constant('CURRENCY_SYMBOL', 'د.ك')
    .constant('DATE_FORMAT', "MM/dd/yyyy h:mma")
    .constant('MAIN_PRMO_BANNER_ID', 262)
    .constant('MAIN_OFFERS_BANNER_ID', 268)
    .constant('OFFERS_PAGE_BANNER_ID', 263)
    .constant('INTERCOM_INTEGRATION', false) // please check www/app/common/services/intercom.service.js
    .constant('ONESIGNAL_APP_ID', "4e059bb1-952e-47f0-9f8b-4a4b13171b06") // get OneSignal app id from http://onesignal.com
    .constant('GCM_SENDER_ID', "1037766790597")
    .constant('MENU_LAYOUT', "tabs")

    // if demo mode is set to true, some dynamic configurations 
    // used only for demo app will appear in info section
    .constant('DEMO_MODE', false)