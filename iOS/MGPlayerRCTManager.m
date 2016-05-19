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

@property UIActivityIndicatorView *activityIndicator;
@property(nonatomic) CGPoint center;
@end

@implementation MGPlayerRCTManager
RCT_EXPORT_MODULE();

- (UIView *)view
{
  [self installMovieNotificationObservers];
  
  self.player = [MGMediaFactory createPlayer: [NSURL URLWithString:self.myurl] forUser:@"zhaohao" withSN:@"104" withKeyPath:nil];
  
  
  self.activityIndicator =
  [[UIActivityIndicatorView alloc] initWithFrame:CGRectMake(0.0f, 0.0f, 80.0f, 80.0f)];
  [self.activityIndicator setCenter:self.center];
  [self.activityIndicator setActivityIndicatorViewStyle:UIActivityIndicatorViewStyleWhite];
  [self.activityIndicator setHidesWhenStopped:YES];
  
  [self.player.view addSubview:self.activityIndicator];
  
  
  [self.activityIndicator startAnimating];
  [self.player prepareToPlay];
  
  return self.player.view;
}

//RCT_EXPORT_METHOD(addVideoPrepared:(RCTResponseSenderBlock)callback)
//{
// self.preparedCallback = callback;
////  callback(@[[input stringByReplacingOccurrencesOfString:@"Goodbye" withString:@"Hello"]]);
//}


RCT_EXPORT_METHOD(setUri:(NSString *)uri)
{
  self.myurl  = uri;
}

RCT_EXPORT_METHOD(setScreen:(NSInteger )width height:(NSInteger)height)
{
  self.center = CGPointMake (width/2, height/2);
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
  
//  [[NSNotificationCenter defaultCenter] addObserver:self
//                                           selector:@selector(moviePlayBackDidFinish:)
//                                               name:MGMPMoviePlayerPlaybackDidFinishNotification
//                                             object:nil];
//  
//  [[NSNotificationCenter defaultCenter] addObserver:self
//                                           selector:@selector(moviePlayBackStateDidChange:)
//                                               name:MGMPMoviePlayerPlaybackStateDidChangeNotification
//                                             object:nil];

}

-(void)removeMovieNotificationObservers
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}


- (void)movieloadStateDidChange:(NSNotification*)notification
{
  if (self.player != [notification object])
  {
    return;
  }
  MGMPMovieLoadState loadState = self.player.loadState;
  
  if ((loadState & MGMPMovieLoadStatePlaythroughOK) != 0)
  {
    [self.activityIndicator stopAnimating];
  }
  else if ((loadState & MGMPMovieLoadStateStalled) != 0)
  {
  }
  else
  {
  }
}

//- (void)moviePlayBackDidFinish:(NSNotification*)notification {
//  if (self.player != [notification object]) {
//    return;
//  }
//  int reason = [[[notification userInfo] valueForKey:MGMPMoviePlayerPlaybackDidFinishReasonUserInfoKey] intValue];
//  
//  switch (reason) {
//    case MGMPMovieFinishReasonPlaybackEnded:
//      NSLog(@"video state 正片播放完成: %d\n", reason);
//      break;
//    case MGMPMovieFinishReasonUserExited:
//      NSLog(@"video state 正片用户退出: %d\n", reason);
//      break;
//    case MGMPMovieFinishReasonPlaybackError:
//    {
//      reason = [[[notification userInfo] valueForKey:@"error"] intValue];
//      NSLog(@"video state 正片播放错误: %d\n", reason);
//    }break;
//    default:
//      NSLog(@"video state playbackPlayBackDidFinish: ???: %d\n", reason);
//      break;
//  }
//}


//- (void)moviePlayBackStateDidChange:(NSNotification*)notification {
//  if (self.player != [notification object]) {
//    return;
//  }
//  
//  switch (self.player.playbackState) {
//    case MGMPMoviePlaybackStateStopped: {
//      NSLog(@"video state 正片状态变为: stoped");
//      break;
//    }
//    case MGMPMoviePlaybackStatePlaying: {
//      NSLog(@"video state 111正片状态变为: playing");
//      break;
//    }
//    case MGMPMoviePlaybackStatePaused: {
//      NSLog(@"video state 正片状态变为: paused");
//      break;
//    }
//    case MGMPMoviePlaybackStateInterrupted: {
//      NSLog(@"video state 正片状态变为: interrupted");
//      break;
//    }
//    case MGMPMoviePlaybackStateSeekingForward:
//    case MGMPMoviePlaybackStateSeekingBackward: {
//      NSLog(@"video state 正片状态变为: seeking");
//      break;
//    }
//    default: {
//      NSLog(@"video state 正片状态变为未知 : %d", (int)_player.playbackState);
//      break;
//    }
//  }
//}






@end
