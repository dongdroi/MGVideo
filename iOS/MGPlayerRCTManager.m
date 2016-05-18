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

  [self installMovieNotificationObservers];
  
  self.player = [MGMediaFactory createPlayer: [NSURL URLWithString:self.myurl] forUser:@"zhaohao" withSN:@"104" withKeyPath:nil];
  
//  self.player.view.autoresizingMask = UIViewAutoresizingFlexibleWidth|UIViewAutoresizingFlexibleHeight;
  [self.player prepareToPlay];
  
  return self.player.view;
}

//RCT_EXPORT_METHOD(setPreparedCallback:(RCTResponseSenderBlock)callback)
//{
//  self.preparedCallback = callback;
//}
//
//RCT_EXPORT_METHOD(addCallBack:(RCTResponseSenderBlock)callback)
//{
//  self.preparedCallback = callback;
//  NSLog(@"adsfasfasdfasfdssdfafdasfasfasfd");
////  callback(@[[input stringByReplacingOccurrencesOfString:@"Goodbye" withString:@"Hello"]]);
//}


RCT_EXPORT_METHOD(setUri:(NSString *)uri)
{
  self.myurl =uri;
}
RCT_EXPORT_METHOD(stop)
{
  if (self.player)
  {
    [self.player pause];
    [self.player stop];
    [self.player shutdown:NO];
    self.player   = nil;
    
    [self removeMovieNotificationObservers];
  }

}

/**
 *播放器的通知信息
 */
-(void)installMovieNotificationObservers
{
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(movieloadStateDidChange:)
                                               name:MGMPMoviePlayerLoadStateDidChangeNotification
                                             object:nil];
  
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(moviePlayBackDidFinish:)
                                               name:MGMPMoviePlayerPlaybackDidFinishNotification
                                             object:nil];
  
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(moviePlayBackStateDidChange:)
                                               name:MGMPMoviePlayerPlaybackStateDidChangeNotification
                                             object:nil];

}

-(void)removeMovieNotificationObservers
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}


- (void)movieloadStateDidChange:(NSNotification*)notification
{
  if (self.player != [notification object]) {
    return;
  }
  MGMPMovieLoadState loadState = self.player.loadState;
  
  if ((loadState & MGMPMovieLoadStatePlaythroughOK) != 0)
  {
    NSLog(@"video state 正片状态成功变为: %d\n", (int)loadState);
  } else if ((loadState & MGMPMovieLoadStateStalled) != 0)
  {
    NSLog(@"video state 正片缓冲中:\n");
  } else
  {
    NSLog(@"video state 正片状态变为: ???: %d\n", (int)loadState);
  }
}

- (void)moviePlayBackDidFinish:(NSNotification*)notification {
  if (self.player != [notification object]) {
    return;
  }
  int reason = [[[notification userInfo] valueForKey:MGMPMoviePlayerPlaybackDidFinishReasonUserInfoKey] intValue];
  
  switch (reason) {
    case MGMPMovieFinishReasonPlaybackEnded:
      NSLog(@"video state 正片播放完成: %d\n", reason);
      break;
    case MGMPMovieFinishReasonUserExited:
      NSLog(@"video state 正片用户退出: %d\n", reason);
      break;
    case MGMPMovieFinishReasonPlaybackError:
    {
      reason = [[[notification userInfo] valueForKey:@"error"] intValue];
      NSLog(@"video state 正片播放错误: %d\n", reason);
    }break;
    default:
      NSLog(@"video state playbackPlayBackDidFinish: ???: %d\n", reason);
      break;
  }
}


- (void)moviePlayBackStateDidChange:(NSNotification*)notification {
  if (self.player != [notification object]) {
    return;
  }
  switch (self.player.playbackState) {
    case MGMPMoviePlaybackStateStopped: {
      NSLog(@"video state 正片状态变为: stoped");
      break;
    }
    case MGMPMoviePlaybackStatePlaying: {
      NSLog(@"video state 正片状态变为: playing");
      break;
    }
    case MGMPMoviePlaybackStatePaused: {
      NSLog(@"video state 正片状态变为: paused");
      break;
    }
    case MGMPMoviePlaybackStateInterrupted: {
      NSLog(@"video state 正片状态变为: interrupted");
      break;
    }
    case MGMPMoviePlaybackStateSeekingForward:
    case MGMPMoviePlaybackStateSeekingBackward: {
      NSLog(@"video state 正片状态变为: seeking");
      break;
    }
    default: {
      NSLog(@"video state 正片状态变为未知 : %d", (int)_player.playbackState);
      break;
    }
  }
}






@end
