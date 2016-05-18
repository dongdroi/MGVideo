//
//  MGPlayerRCTManager.m
//  MiguProjectTest
//
//  Created by 谈燕清 on 16/4/26.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "MGPlayerRCTManager.h"
#import <MediaPlayer/MediaPlayer.h>
#import <MapKit/MapKit.h>


@interface MGPlayerRCTManager ()
@property MPMoviePlayerViewController *movie;
@property NSString* myurl;
@end

@implementation MGPlayerRCTManager
RCT_EXPORT_MODULE();

- (UIView *)view
{
//  self.player = [MGMediaFactory createPlayer: [NSURL URLWithString:@"http://221.181.100.110:8080/gslbadapter/forwardServlet?type=vod"] forUser:@"zhaohao" withSN:@"104" withKeyPath:nil];

  
  self.player = [MGMediaFactory createPlayer: [NSURL URLWithString:self.myurl] forUser:@"zhaohao" withSN:@"104" withKeyPath:nil];

  self.player.view.autoresizingMask = UIViewAutoresizingFlexibleWidth|UIViewAutoresizingFlexibleHeight;
  [self.player prepareToPlay];
  
  return self.player.view;
}


RCT_EXPORT_METHOD(setUri:(NSString *)uri)
{
  self.myurl =uri;
}
RCT_EXPORT_METHOD(stop)
{
  NSLog(@"1----------------stop");
}




@end
