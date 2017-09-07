# Do me now app
## Table of Contents

* [Before you begin](#before_you_begin) 
* [Installation](#init_application)
* [Using the Cordova Plugin](#using_cordova)
* [ChangeLog](#change_log)
* [Copyrights](#copyrights)


<a name="before_you_begin"></a>
## Before you begin

Make sure you install the following tools and libraries.

* You should already have Node.js/npm and the Cordova package installed. If you don't, you can download and install Node from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

* The Ionic CLI tool is also required. You can find instructions to install Ionic Cordova and set up your Cordova app at [http://ionicframework.com/docs/cli/](http://ionicframework.com/docs/cli/).
    * Make sure you are using Cordova version is 6.3.0 or below.

* You should have Cocoapods installed. If you don't, you can download and install Cocoapods from [http://cocoapods.org/](http://cocoapods.org/) 

To create a Cordova application, use the Cordova Plugin for the IBM Bluemix Mobile Services Core SDK:

1. Create a Cordova application
2. Add Cordova platforms
3. Add Cordova plugin
4. Configure your platform 

<a name="init_application"></a>
## Installation

### 1. Create the project

1. Run the following commands to create a new Cordova application. Alternatively you can use an existing application as well. 

	```
	$ ionic start Domenow blank
	$ cd Domenow && ls
	```
	
2. Edit the `config.xml` file and set the desired application name in the `<name>` element instead of a default HelloCordova.

3. Continue editing `config.xml`


### 2. Adding Cordova platforms

Run the following commands for the platforms that you want to add to your Cordova application:

```Bash
ionic platform add ios

ionic platform add android
```

### 3. Adding Cordova plugin

Run the following command from your Cordova application's root directory to add the bms-core plugin:

```Bash
ionic plugin add cordova-plugin-console
ionic plugin add cordova-plugin-dialogs
ionic plugin add cordova-plugin-inappbrowser
ionic plugin add bms-push
```

You can check if the plugin installed successfully by running the following command, which lists your installed Cordova plugins:

```Bash
ionic plugin list
```

### 4. Configuring your platform

#### Configuring Your iOS Environment

**Note**: Before you begin, make sure that you are using Xcode 7 or above.

1. Run `cordova prepare ios` to prepare the Cordova application with the necessary CocoaPod dependencies.

2. Build and run your application with Xcode or by running the following command:

    ```Bash
    ionic build ios
    ``` 
    
#### Configuring Your Android Environment

1. Build your Android project by running the following command:

    ```Bash
    ionic build android
    ```

**Important**: Before opening your project in Android Studio, you **must** first build your Cordova application through the Cordova commmand-line interface (CLI). Otherwise, you will encounter build errors.

<a name="using_cordova"></a>
## Using the Cordova Plugin

* bms-clientsdk-cordova-plugin-push
[https://github.com/ibm-bluemix-mobile-services/bms-clientsdk-cordova-plugin-push](https://github.com/ibm-bluemix-mobile-services/bms-clientsdk-cordova-plugin-push)

* bms-clientsdk-cordova-plugin-core
[https://github.com/ibm-bluemix-mobile-services/bms-clientsdk-cordova-plugin-core](https://github.com/ibm-bluemix-mobile-services/bms-clientsdk-cordova-plugin-core)


<a name="change_log"></a>
## Change log

##### 0.0.1
* Initial release


<a name="copyrights"></a>
## Copyrights
Copyright 2017 MobileTarget.

You may not use this file except in compliance with the License.
