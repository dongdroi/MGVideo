//
//  MGPlayerRCTManager.h
//  MiguProjectTest
//
//  Created by 谈燕清 on 16/4/26.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTViewManager.h"
#import "RCTBridgeModule.h"
#import <MGMediaFramework/MGMediaFramework.h>

@interface MGPlayerRCTManager : RCTViewManager<RCTBridgeModule>

@property(atomic, retain) id<MGMediaPlayer> player;


@end
