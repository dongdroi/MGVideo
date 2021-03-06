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

@property(nonatomic,strong) UIView* myMediaView;
@property(nonatomic,strong) UIButton *playButton;
@property(nonatomic,strong) UIButton *pauseButton;
@property(nonatomic,strong) UIButton *fullScreenButton;
@property(nonatomic,strong) UILabel *currentTimeLabel;
@property(nonatomic,strong) UILabel *totalDurationLabel;
@property(nonatomic,strong) UISlider *mediaProgressSlider;


@property (nonatomic, copy) RCTResponseSenderBlock myCallBack;
@end

@implementation MGPlayerRCTManager
{
  BOOL _isMediaSliderBeingDragged;
}
RCT_EXPORT_MODULE();


- (UIView *)view
{
  [self installMovieNotificationObservers];
  
  self.player = [MGMediaFactory createPlayer: [NSURL URLWithString:self.myurl] forUser:@"zhaohao" withSN:@"104" withKeyPath:nil];
  
  [self initLoading];
  [self initMedia];
  
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
  }
  
  self.player   = nil;
  self.myCallBack = nil;
  
  [self removeMovieNotificationObservers];

}

RCT_EXPORT_METHOD(setCallBack:(RCTResponseSenderBlock)callback)
{
  self.myCallBack = callback;
}


-(void)initLoading
{
  self.activityIndicator =
  [[UIActivityIndicatorView alloc] initWithFrame:CGRectMake(0.0f, 0.0f, 80.0f, 80.0f)];
  [self.activityIndicator setCenter:self.center];
  [self.activityIndicator setActivityIndicatorViewStyle:UIActivityIndicatorViewStyleWhite];
  [self.activityIndicator setHidesWhenStopped:YES];
  [self.player.view addSubview:self.activityIndicator];
  
  [self.activityIndicator startAnimating];

}

-(void)initMedia
{
  self.myMediaView =[[UIView alloc]initWithFrame:CGRectMake(0.0, 0.0, self.center.x*2, self.center.y*2)];
  self.myMediaView.userInteractionEnabled = YES;
  [self.myMediaView addGestureRecognizer:[[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(mediaViewTouchDown:)]];
  
  NSInteger gap = 5.0;
  NSInteger viewHeight = 40;
  
  UIView *bottomView =
  [[UIView alloc]initWithFrame:CGRectMake(0.0, self.center.y * 2 - viewHeight, self.center.x*2, viewHeight)];
  [self.myMediaView addSubview:bottomView];
  
  
  CGPoint startPoint = CGPointMake(gap,  bottomView.frame.size.height/2);
  
  
  CGRect buttonRect = CGRectMake(startPoint.x, (viewHeight - 20)/2, 20.0f, 20.0f);
  self.playButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
  [self.playButton setFrame:buttonRect];
  [self.playButton setImage:[UIImage imageNamed:@"ic_media_play"] forState:UIControlStateNormal];
  [self.playButton setBackgroundImage:[UIImage imageNamed:@"ic_media_play"] forState:UIControlStateNormal];
  [self.playButton addTarget:self action:@selector(onClickPlay:) forControlEvents:UIControlEventTouchUpInside];
  [bottomView addSubview:self.playButton];
  
  self.pauseButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
  [self.pauseButton setFrame:buttonRect];
  [self.pauseButton setImage:[UIImage imageNamed:@"ic_media_pause"] forState:UIControlStateNormal];
  [self.pauseButton setBackgroundImage:[UIImage imageNamed:@"ic_media_pause"] forState:UIControlStateNormal];
  [self.pauseButton addTarget:self action:@selector(onClickPause:) forControlEvents:UIControlEventTouchUpInside];
  [bottomView addSubview:self.pauseButton];
  
  startPoint.x += buttonRect.size.width + gap;
  
  
  CGRect currentTimeRect = CGRectMake(startPoint.x, (viewHeight - 16)/2, 40.0f, 16.0f);
  self.currentTimeLabel = [[UILabel alloc]initWithFrame:currentTimeRect];
  self.currentTimeLabel.textColor = [UIColor whiteColor];
  self.currentTimeLabel.text = @"--:--";
  self.currentTimeLabel.numberOfLines = 1;
  self.currentTimeLabel.adjustsFontSizeToFitWidth = YES;
  self.currentTimeLabel.font = [UIFont boldSystemFontOfSize:10];
  [bottomView addSubview:self.currentTimeLabel];
  
  startPoint.x += currentTimeRect.size.width + gap;
  
  //左右轨的图片
  UIImage *stetchLeftTrack= [UIImage imageNamed:@"slide_bar.png"];
  UIImage *stetchRightTrack = [UIImage imageNamed:@"slide_bar.png"];
  //滑块图片
  UIImage *thumbImage = [UIImage imageNamed:@"slide_mark.png"];
  
  CGRect sliderRect = CGRectMake(startPoint.x, (viewHeight - 20)/2, self.center.x*2 - startPoint.x - currentTimeRect.size.width - gap*2 - buttonRect.size.width, 20);
  self.mediaProgressSlider = [[UISlider alloc]initWithFrame:sliderRect];
  [self.mediaProgressSlider addTarget:self action:@selector(sliderValueChanged:) forControlEvents:UIControlEventValueChanged];
  [self.mediaProgressSlider addTarget:self action:@selector(beginDragMediaSlider:)  forControlEvents:UIControlEventTouchDown];
  [self.mediaProgressSlider addTarget:self action:@selector(endDragMediaSlider:)  forControlEvents:UIControlEventTouchCancel];
  [self.mediaProgressSlider addTarget:self action:@selector(didSliderTouchUpInside:)  forControlEvents:UIControlEventTouchUpInside];
  [self.mediaProgressSlider addTarget:self action:@selector(didSliderTouchUpOutside:)  forControlEvents:UIControlEventTouchUpOutside];
  
  [self.mediaProgressSlider setMinimumTrackImage:stetchLeftTrack forState:UIControlStateNormal];
  [self.mediaProgressSlider setMaximumTrackImage:stetchRightTrack forState:UIControlStateNormal];
  [self.mediaProgressSlider setThumbImage:thumbImage forState:UIControlStateHighlighted];
  [self.mediaProgressSlider setThumbImage:thumbImage forState:UIControlStateNormal];
  [bottomView addSubview:self.mediaProgressSlider];
  
  startPoint.x += sliderRect.size.width + gap;
  
  
  CGRect totalTimeRect = CGRectMake(startPoint.x, (viewHeight - 16)/2, 40.0f, 16.0f);
  self.totalDurationLabel = [[UILabel alloc]initWithFrame:totalTimeRect];
  self.totalDurationLabel.textColor = [UIColor whiteColor];
  self.totalDurationLabel.text = @"--:--";
  self.totalDurationLabel.numberOfLines = 1;
  self.totalDurationLabel.adjustsFontSizeToFitWidth = YES;
  self.totalDurationLabel.font = [UIFont boldSystemFontOfSize:10];
  [bottomView addSubview:self.totalDurationLabel];
  
  startPoint.x += totalTimeRect.size.width + gap;
  
  
  CGRect fullScreenRect = CGRectMake(startPoint.x, (viewHeight - 20)/2, buttonRect.size.width, buttonRect.size.height);
  self.fullScreenButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
  [self.fullScreenButton setFrame:fullScreenRect];
  [self.fullScreenButton setImage:[UIImage imageNamed:@"ic_media_full"] forState:UIControlStateNormal];
  [self.fullScreenButton setBackgroundImage:[UIImage imageNamed:@"ic_media_full"] forState:UIControlStateNormal];
  [self.fullScreenButton addTarget:self action:@selector(onClickFullScreen:) forControlEvents:UIControlEventTouchUpInside];
  [bottomView addSubview:self.fullScreenButton];
  
  [self.player.view addSubview:self.myMediaView];
  
  
  self.player.view.userInteractionEnabled = YES;
  [self.player.view addGestureRecognizer:[[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(playerTouchDown:)]];

  [self showAndFade];
  [self performSelector:@selector(refreshMediaControl) withObject:nil afterDelay:0.5];
}


-(void)refreshMediaControl
{
  NSTimeInterval duration = self.player.duration;
  NSInteger intDuration = duration + 0.5;
  if (intDuration > 0) {
    self.mediaProgressSlider.maximumValue = duration;
    self.totalDurationLabel.text = [NSString stringWithFormat:@"%02d:%02d", (int)(intDuration / 60), (int)(intDuration % 60)];
  }
  else {
    self.totalDurationLabel.text = @"--:--";
    self.mediaProgressSlider.maximumValue = 1.0f;
  }
  
  
  
  NSTimeInterval position;
  if (_isMediaSliderBeingDragged && self.player.duration != 0) {
    position = self.mediaProgressSlider.value;
  } else {
    position = self.player.currentPlaybackTime;
  }
  
  NSInteger intPosition = position + 0.5;
  if (intDuration > 0) {
    self.mediaProgressSlider.value = position;
  } else {
    self.mediaProgressSlider.value = 0.0f;
  }
  self.currentTimeLabel.text = [NSString stringWithFormat:@"%02d:%02d", (int)(intPosition / 60), (int)(intPosition % 60)];
  
  if (self.myMediaView && !self.myMediaView.hidden)
  {
    [self performSelector:@selector(refreshMediaControl) withObject:nil afterDelay:0.5];
  }
  
  
  BOOL isPlaying = [self.player isPlaying];
  self.playButton.hidden = isPlaying;
  self.pauseButton.hidden = !isPlaying;
}

/**
 *控制界面的显示和隐藏
 */
- (void) playerTouchDown:(id)sender
{
  [self showAndFade];
}
-(void) mediaViewTouchDown:(id)sender
{
  [self hide];
}

- (void)showNoFade
{
  self.myMediaView.hidden = NO;
  [self cancelDelayedHide];
  [self refreshMediaControl];
}

- (void)showAndFade
{
  [self showNoFade];
  [self performSelector:@selector(hide) withObject:nil afterDelay:5];
}

- (void)hide
{
  self.myMediaView.hidden = YES;
  [self cancelDelayedHide];
}
- (void)cancelDelayedHide {
  [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(hide) object:nil];
}

/**
 *控制界面的按钮
 */
- (void) onClickPlay:(id)sender
{
  if (self.player)
  {
    [self.player play];
    [self showAndFade];
  }
  
}
- (void) onClickPause:(id)sender
{
  if (self.player)
  {
    [self.player pause];
    [self showAndFade];
  }
}

- (void) onClickFullScreen:(id)sender
{
}

/**
 *进度条相关监听
 */
- (void) sliderValueChanged:(id)sender
{
  [self refreshMediaControl];
}
- (void) beginDragMediaSlider:(id)sender
{
  _isMediaSliderBeingDragged = YES;
   [self showNoFade];
}
- (void) didSliderTouchUpInside:(id)sender
{
  [self.player setCurrentPlaybackTime:self.mediaProgressSlider.value];
  _isMediaSliderBeingDragged = NO;
  [self showAndFade];
}
- (void) didSliderTouchUpOutside:(id)sender
{
  [self.player setCurrentPlaybackTime:self.mediaProgressSlider.value];
  _isMediaSliderBeingDragged = NO;
  [self showAndFade];
}

- (void) endDragMediaSlider:(id)sender
{
  _isMediaSliderBeingDragged = NO;
  [self showAndFade];
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
  if (self.player != [notification object])
  {
    return;
  }
  MGMPMovieLoadState loadState = self.player.loadState;
  
  if ((loadState & MGMPMovieLoadStatePlaythroughOK) != 0)
  {
    [self.activityIndicator stopAnimating];
//    if (self.myCallBack)self.myCallBack(@[@"test0",@"test",@"test2"]);
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
      NSLog(@"video state 111正片状态变为: playing");
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
