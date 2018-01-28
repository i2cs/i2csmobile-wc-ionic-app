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
    .constant('WELCOME_SLIDES', [
            {
                title: "Welcome 😍",
                text: 'congratulations! You have installed i2CSMobile WooCommerce on your phone. This app contains featres you can integrate with your WooCommerce website<br/><br/>💬 Talk with us! We would love to help you create a mobile app for your WooCommerce website',
                image: 'img/welcome/slide1.gif'
            },
            {
                title: "Complete Checkout with Payment Integration",
                text: 'Convert your WooCommerce store into fully functional mobile app and start accepting new orders.',
                image: 'img/welcome/slide2.png'
            },
            {
                title: "Push Notifications & More",
                text: 'Reach all your mobile app users with power of push notifications. Send product updates, offers or notices within seconds',
                image: 'img/welcome/slide3.png'
            },
            {
                title: "Multiple Languages and RTL Layout Support",
                text: 'Talk in your customers native language with i2CSMobile i18n framework. This app supports RTL (Right to Left) layout for Arabic languages',
                image: 'img/welcome/slide4.png'
            },
            {
                title: "Customizable & Full Source Code",
                text: 'i2CSMobile is built with Ionic Framework and easily customizable the way you want. And the best thing is, we provide full source code for the mobile app',
                image: 'img/welcome/slide5.png'
            }
    ])
    .constant('RTL_LANGUAGES', ['ar'])
    .constant('CURRENCY_SYMBOL', '$')
    .constant('DATE_FORMAT', "MM/dd/yyyy h:mma")
    .constant('MAIN_PRMO_BANNER_ID', 112)
    .constant('MAIN_OFFERS_BANNER_ID', 103)
    .constant('OFFERS_PAGE_BANNER_ID', 103)
    .constant('INTERCOM_INTEGRATION', true) // please check www/app/common/services/intercom.service.js
    .constant('ONESIGNAL_APP_ID', "9302072d-783a-41f4-b3dc-80359f64ef96") // get OneSignal app id from http://onesignal.com
    .constant('GCM_SENDER_ID', "1037766790597")
    .constant('MENU_LAYOUT', "tabs")

    // if demo mode is set to true, some dynamic configurations 
    // used only for demo app will appear in info section
    .constant('DEMO_MODE', false)