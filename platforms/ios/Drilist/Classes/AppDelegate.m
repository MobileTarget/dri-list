/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//
//  AppDelegate.m
//  MyApp
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//

#import "AppDelegate.h"
#import "MainViewController.h"
#import "Drilist-Swift.h"
#import "MyNotificationView.h"
@implementation AppDelegate

- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    self.viewController = [[MainViewController alloc] init];
    if (launchOptions[UIApplicationLaunchOptionsRemoteNotificationKey]) {
        [[CDVBMSPush sharedInstance] didReceiveRemoteNotificationOnLaunchWithLaunchOptions:launchOptions];
    }
    
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

    // Register device token with Bluemix Push Notification Service
- (void)application:(UIApplication *)application
didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken{
    
	   [[CDVBMSPush sharedInstance] didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
    
    // Handle error when failed to register device token with APNs
- (void)application:(UIApplication*)application
didFailToRegisterForRemoteNotificationsWithError:(NSError*)error {
    
    [[CDVBMSPush sharedInstance] didFailToRegisterForRemoteNotificationsWithError:error];
}
    
    // Handle receiving a remote notification
-(void)application:(UIApplication *)application
didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
    //NSLog(@"comes in objective didReceiveRemoteNotification code which is in appdelicate.m file  -- %@", userInfo);
    
    
    
    if (application.applicationState == UIApplicationStateActive) {
// generate uilocal notification
//        
//        NSLog(@"aps   %@", userInfo[@"aps"]);
//         NSLog(@"aps===== alert  %@", userInfo[@"aps"][@"alert"]);
//         NSLog(@"aps===== alert ==== body  %@", userInfo[@"aps"][@"alert"][@"body"]);
        
        MPNotificationView *notification = [MPNotificationView notifyWithText:@"Drilist notificaiton" andDetail:userInfo[@"aps"][@"alert"][@"body"]];
        notification.delegate = self;
    }else{
       [[CDVBMSPush sharedInstance] didReceiveRemoteNotificationWithNotification:userInfo];
    }
}
    

@end


