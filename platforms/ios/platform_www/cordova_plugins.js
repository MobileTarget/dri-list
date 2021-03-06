cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-console/www/console-via-logger.js",
        "id": "cordova-plugin-console.console",
        "pluginId": "cordova-plugin-console",
        "clobbers": [
            "console"
        ]
    },
    {
        "file": "plugins/cordova-plugin-console/www/logger.js",
        "id": "cordova-plugin-console.logger",
        "pluginId": "cordova-plugin-console",
        "clobbers": [
            "cordova.logger"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "id": "cordova-plugin-statusbar.statusbar",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/ionic-plugin-keyboard/www/ios/keyboard.js",
        "id": "ionic-plugin-keyboard.keyboard",
        "pluginId": "ionic-plugin-keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ],
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "id": "cordova-plugin-dialogs.notification",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "file": "plugins/bms-core/www/BMSClient.js",
        "id": "bms-core.BMSClient",
        "pluginId": "bms-core",
        "clobbers": [
            "BMSClient"
        ]
    },
    {
        "file": "plugins/bms-core/www/BMSRequest.js",
        "id": "bms-core.BMSRequest",
        "pluginId": "bms-core",
        "clobbers": [
            "BMSRequest"
        ]
    },
    {
        "file": "plugins/bms-core/www/BMSLogger.js",
        "id": "bms-core.BMSLogger",
        "pluginId": "bms-core",
        "clobbers": [
            "BMSLogger"
        ]
    },
    {
        "file": "plugins/bms-core/www/BMSAnalytics.js",
        "id": "bms-core.BMSAnalytics",
        "pluginId": "bms-core",
        "clobbers": [
            "BMSAnalytics"
        ]
    },
    {
        "file": "plugins/bms-core/www/BMSAuthorizationManager.js",
        "id": "bms-core.BMSAuthorizationManager",
        "pluginId": "bms-core",
        "clobbers": [
            "BMSAuthorizationManager"
        ]
    },
    {
        "file": "plugins/bms-push/www/BMSPush.js",
        "id": "bms-push.BMSPush",
        "pluginId": "bms-push",
        "clobbers": [
            "BMSPush"
        ]
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.local-notification/www/local-notification.js",
        "id": "de.appplant.cordova.plugin.local-notification.LocalNotification",
        "pluginId": "de.appplant.cordova.plugin.local-notification",
        "clobbers": [
            "cordova.plugins.notification.local",
            "plugin.notification.local"
        ]
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.local-notification/www/local-notification-core.js",
        "id": "de.appplant.cordova.plugin.local-notification.LocalNotification.Core",
        "pluginId": "de.appplant.cordova.plugin.local-notification",
        "clobbers": [
            "cordova.plugins.notification.local.core",
            "plugin.notification.local.core"
        ]
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.local-notification/www/local-notification-util.js",
        "id": "de.appplant.cordova.plugin.local-notification.LocalNotification.Util",
        "pluginId": "de.appplant.cordova.plugin.local-notification",
        "merges": [
            "cordova.plugins.notification.local.core",
            "plugin.notification.local.core"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-console": "1.1.0",
    "cordova-plugin-device": "1.1.4",
    "cordova-plugin-splashscreen": "4.0.3",
    "cordova-plugin-statusbar": "2.2.1",
    "cordova-plugin-whitelist": "1.3.1",
    "ionic-plugin-keyboard": "2.2.1",
    "cordova-plugin-dialogs": "1.3.3",
    "cordova-plugin-inappbrowser": "1.7.1",
    "cordova-plugin-cocoapod-support": "1.2.10",
    "cordova-plugin-add-swift-support": "1.7.0",
    "bms-core": "2.3.8",
    "bms-push": "3.2.1",
    "cordova-plugin-app-event": "1.2.1",
    "de.appplant.cordova.plugin.local-notification": "0.8.4"
}
// BOTTOM OF METADATA
});