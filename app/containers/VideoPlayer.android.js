'use strict';

import React, {
  Component,
  StyleSheet,
  BackAndroid,
  Platform,
  Text,
  Image,
  View,
  ListView,
  ScrollView,
  TouchableOpacity,
  InteractionManager,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';

import PlayBillLayout from '../layouts/PlayBillLayout';
import VideoMenuLayout from '../layouts/VideoMenuLayout';
import VideoDetailLayout from '../layouts/VideoDetailLayout';
import SerialGridLayout from '../layouts/SerialGridLayout';
import RelatedListLayout from '../layouts/RelatedListLayout';

import LoadingView from '../components/LoadingView';
import {fetchDetail, fetchVideoPath, clearDetail} from '../actions/detail';
import ReadingToolbar from '../components/ReadingToolbar';
import MGVideo from 'react-native-mgvideo';
import {NaviGoBack} from '../utils/CommonUtils';
import {ToastShort} from '../utils/ToastUtils';
import Portal from 'react-native/Libraries/Portal/Portal.js';

import ReadingTabBar from '../components/ReadingTabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import Share from 'react-native-share';

var PixelRatio = require('PixelRatio');
var Dimensions = require('Dimensions');
//var TimerMixin = require('react-timer-mixin');

const PX_UNIT = 1 / PixelRatio.get();
const defaultPadding = 10;
const VideoWidth = Dimensions.get('window').width;
const VideoHeight = VideoWidth * 9 / 16;
const shareHeight = VideoHeight / 5;

//电视剧集表格
var serialGap = 16;
var serialWidth = (VideoWidth - serialGap * 4 - defaultPadding * 2) / 5;
var serialHeight = serialWidth * 3 / 4;

let tag;
var programId;
var timer;
var videoDetail = new Object();

Date.prototype.format = function(fmt) {
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}
var today = new Date().format('yyyyMMdd');

var mDeviceEventEmitter;
var myfullscreen;

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    const {route} = this.props;
    programId = route.programId;
    //console.log("VideoPlayer programId = " + programId);
    this.state = {
      dataSource: new ListView.DataSource({           //评论列表
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      videoMarked: false,                             //视频是否收藏
      needStopPlay: false,                            //退出播放界面
      animPlaying: true,                              //进入播放界面的动画
    };
    this.renderItem = this.renderItem.bind(this);
    this.goBack = this.goBack.bind(this);
    this.onMarkButtonPress = this.onMarkButtonPress.bind(this);
    this.onShareButtonPress = this.onShareButtonPress.bind(this);
    this.onVideoSelected = this.onVideoSelected.bind(this);
    this.onBillItemClicked = this.onBillItemClicked.bind(this);
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      tag = Portal.allocateTag();
    }
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.goBack);

    const {dispatch} = this.props;

    InteractionManager.runAfterInteractions(() => {
        dispatch(fetchDetail(programId));
    });

    setTimeout(() => {
        this.setState(
          {
            animPlaying: false
          }
        );
    }, 1000);
    
    if (!mDeviceEventEmitter)
    {
      mDeviceEventEmitter = DeviceEventEmitter.addListener(
              'fullScreenCallback',
              (response) => {
                this.changeToFullScreen(response);
              }
      );
    }
  }

  componentWillUnmount() {
    //console.log('componentWillUnmount');
    //if (timer != undefined) {       //清除定时器
    //    TimerMixin.clearTimeout(timer);
    //}
    const {dispatch} = this.props;

    InteractionManager.runAfterInteractions(() => {
        dispatch(clearDetail(programId));
    });

    BackAndroid.removeEventListener('hardwareBackPress', this.goBack);
    
    if (mDeviceEventEmitter)
    {
      mDeviceEventEmitter.remove();
    }
  }

  changeToFullScreen(response) {
    console.log('changeToFullScreen ' + response.orientation);
    myfullscreen = response.orientation != 1;
    this.forceUpdate ();
  }

  goBack() {
    if (Portal.getOpenModals().length != 0)
    {
        Portal.closeModal(tag);
        return true;
    } else
    {
      if (myfullscreen)
      {
        NativeModules.OrientationModule.setRequestedOrientation(1);
        return true;
      } else 
      {
        this.setState({needStopPlay: true});
      }
    }
    return NaviGoBack(this.props.navigator);
  }

  onMarkButtonPress() {
    this.setState({videoMarked: !this.state.videoMarked});
    ToastShort(this.state.videoMarked ? '收藏成功' : '取消收藏');
  }

  onShareButtonPress() {
    Portal.showModal(tag, this.renderShareDialog());
  }

  onShareSelected(scene) {
    const {detail} = this.props;
    var fields;
    if (detail.nodeContent.fields != undefined) {
      fields = detail.nodeContent.fields;
    } else if (detail.nodeDetail.fields != undefined) {
      fields = detail.nodeDetail.fields;
    }
    if (fields == undefined) return;
    const url = 'http://m.cmvideo.cn/wap/resource/mh/share/migushare.jsp?cid='+programId;
    NativeModules.MGShareSdkModule.share(scene,
        { type: 'webpage',
          title: fields.Name,
          description: fields.Detail,
          webpageUrl: url,
        },
        (result)=>{
          console.log('onShareSelected result = ' + result);
        }
    );
  }

  onVideoSelected(programId) {
    const {dispatch, detail} = this.props;
    InteractionManager.runAfterInteractions(() => {
        dispatch(fetchDetail(programId));
    });
  }

  onBillItemClicked(start, end) {
		const {dispatch, detail} = this.props;
    var contentId = detail.nodeDetail.fields.MMS_ID;
		var visitPath = detail.nodeDetail.fields.mediafiles.mediafile[1].visitPath;

		var startTime = start.format('yyyyMMddhhmmss');
		var endTime = end.format('yyyyMMddhhmmss');
		InteractionManager.runAfterInteractions(() => {
			  dispatch(fetchVideoPath(visitPath, contentId, startTime, endTime));
		});
  }
  
  renderShareDialog() {
     return (
        <View key={'spinner'} style={styles.spinner}>
        <View style={styles.spinnerContent}>
          <Text style={styles.spinnerTitle}>分享到</Text>
          <View style={{height: PX_UNIT, marginTop: 12, backgroundColor:'#ff8f00'}}/>
          <View style={{flexDirection: 'row', marginTop: 12}}>
            <TouchableOpacity style={{flex: 1}} onPress={this.onShareSelected.bind(this, 0)}>
                <View style={styles.shareContent} >
                  <Image style={styles.shareIcon} source={require('../img/ic_share_weixin.png')}/>
                  <Text style={styles.shareTitle}>微信</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}} onPress={this.onShareSelected.bind(this, 1)}>
               <View style={styles.shareContent}>
                  <Image style={styles.shareIcon} source={require('../img/ic_share_pengyou.png')}/>
                  <Text style={styles.shareTitle}>朋友圈</Text>
               </View>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 1}} onPress={this.onShareSelected.bind(this, 2)}>
               <View style={styles.shareContent} >
                  <Image style={styles.shareIcon} source={require('../img/ic_share_weibo.png')}/>
                  <Text style={styles.shareTitle}>微博</Text>
               </View>
            </TouchableOpacity>
          </View>
          <View style={{height: PX_UNIT, marginTop: 12, backgroundColor:'#ff8f00'}}/>
          <TouchableOpacity style={{marginTop: 12}} onPress={this.goBack.bind(this)}>
            <Text style={[styles.spinnerTitle, {fontSize: 16}]}>取消</Text>
          </TouchableOpacity>
        </View>
      </View>
     );
  }

  renderItem(item) {
    return (
      <TouchableOpacity>
        <View style={styles.listItem}>
          <View style={styles.userImage}>
            <Image style={{width:24, height: 24, resizeMode: Image.resizeMode.contain}}
              source={require('../img/logo.png')} />
          </View>
          <View style={styles.commentInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userComment}>{item.comment}</Text>
            <Text style={styles.userTime}>{item.time}</Text>
            <View style={{width:360, height:1, backgroundColor:'#c0c0c0'}}></View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    //const {route} = this.props;
    const {navigator, detail} = this.props;
    const nodeDetail = detail.nodeDetail;
    const nodeContent = detail.nodeContent;

    var fields;
    var isNodeContent = false;
    if (nodeContent.fields != undefined) {
      isNodeContent = true;
      fields = nodeContent.fields;
    } else if (nodeDetail.fields != undefined) {
      fields = nodeDetail.fields;
    }

    var videoName = '正在加载...';
    //var videoPath;
    console.log("VideoPlayer detail = " + nodeDetail.fields + ",content = " + nodeContent.fields 
        + ',videoPath = ' + detail.videoPath + ',myfullscreen = ' + myfullscreen);

    if (fields == undefined) {
      return <LoadingView/>;
    } else {
      programId = isNodeContent ? nodeContent._id : nodeDetail._id;
      var mainActor = '';
      const propertyList = fields.propertyFileLists.propertyFile;
      if (propertyList != undefined && propertyList.length > 0) {            //数据结构不统一
        propertyList.forEach((property) => {
          if (property.propertyKey == '导演') {
            videoDetail.director = property.propertyValue;
          } else if (property.propertyKey == '主演') {
            mainActor = mainActor + property.propertyValue + ' '
          }
        });
      }
      videoDetail.programId = programId;
      videoDetail.name = fields.Name;
      if (mainActor != '') {
        videoDetail.mainActor = mainActor;
      }
      if (fields.Detail != '') {
        videoDetail.description = fields.Detail;
      }
      videoName = fields.Name;
    }

    var serialLists = [];
    if (fields.DISPLAYTYPE == '500020') {
       if (detail.playBill.Playbill != undefined) {
         serialLists.push(
           <PlayBillLayout key={0} playBill={detail.playBill.Playbill} programId={programId}
              videoPath={detail.videoPath} onBillItemClicked={this.onBillItemClicked}/>
         );
       }
    } else {
        var serialIds = [];
        if (nodeDetail.fields != undefined && nodeDetail.fields.SerialCount > 0) {
          serialIds = nodeDetail.fields.SubSerial_IDS;
        }
        serialLists.push(
          <VideoDetailLayout key={1} style={styles.videoDetail} detail={videoDetail} programId={programId}/>
        );
        if (fields.DISPLAYTYPE == '1001' || fields.DISPLAYTYPE == '1007') {
          serialLists.push(
            <SerialGridLayout key={2} style={styles.serialGrid} serialGap={serialGap}
                serialWidth={serialWidth} serialHeight={serialHeight} serialIds={serialIds}
                programId={programId} onVideoSelected={this.onVideoSelected}/>
          );
        } else if (fields.DISPLAYTYPE == '1005' || fields.DISPLAYTYPE == '1004') { //综艺选集，咪咕新闻汇
            if (detail.nodeRelated.length == 3) {
                serialLists.push(
                  <RelatedListLayout key={3} style={styles.serialGrid} programId={programId}
                      nodeRelated={detail.nodeRelated} onVideoSelected={this.onVideoSelected}/>
                );
            }
        }
    }

    return (
         <View style={styles.container}>
            <View style={myfullscreen ? styles.content : {width:VideoWidth, height:VideoHeight, 
                  backgroundColor: 'black'}}>
                {
                  this.state.animPlaying ? null :
                    <MGVideo videoPath={detail.videoPath} stopped={this.state.needStopPlay} 
                      resizeMode={myfullscreen ? 1 : 0}/>
                }
            </View>
            <TouchableOpacity style={styles.gotoback} onPress={this.goBack}>
                <Image style={{width: 24, height: 24}}
                source={require('../img/ic_video_back.png')}></Image>
                <Text style={{fontSize:14, color:'white', textAlign:'left'}}>{videoName}</Text>
            </TouchableOpacity>
            {
              myfullscreen ? null :
                <VideoMenuLayout style={styles.shareMenu} videoMarked={this.state.videoMarked} times={'1000万次'}
                  onMarkButtonPress={this.onMarkButtonPress} onShareButtonPress={this.onShareButtonPress.bind(this)} />
            }
            {
              myfullscreen ? null :
              (serialLists.length == 1 ? serialLists :      //直播只支持局部滑动
                <ScrollView automaticallyAdjustContentInsets={false} horizontal={false}
                    showsVerticalScrollIndicator={false}>
                  {serialLists}
                </ScrollView>
              )
            }
          </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  content: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black'
  },
  shareMenu: {
    flexDirection: 'row',
    backgroundColor: '#3c3c3c',
    height: shareHeight,
    paddingLeft: defaultPadding,
    paddingRight: defaultPadding
  },
  gotoback: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    height: 36,
    paddingLeft: defaultPadding,
  },
  videoDetail: {
    flexDirection: 'column',
    marginTop: defaultPadding,
    paddingLeft: defaultPadding,
    paddingRight: defaultPadding,
    backgroundColor: 'white',
  },
  serialGrid: {
    flexDirection:'column',
    marginTop: 8,
    paddingLeft: defaultPadding,
    paddingRight: defaultPadding
  },
  spinner: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)'
  },
  spinnerContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: 300,
    height: 200,
    backgroundColor: '#fcfcfc',
  },
  spinnerTitle: {
    fontSize: 18,
    color: '#ff8f00',
    textAlign: 'center'
  },
  shareContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  shareIcon: {
    width: 48,
    height: 48
  },
  shareTitle: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    marginTop: 4,
  },
  listView: {
    marginTop: 12,
    backgroundColor: '#ffffff'
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fcfcfc',
    height: 72,
  },
  userImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 8
  },
  commentInfo:{
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 12
  },
  userName: {
    flex: 1,
    fontSize: 12,
    textAlign: 'left',
    color: 'black',
  },
  userComment:{
    flex: 1,
    fontSize: 10,
    textAlign: 'left',
    color: '#bdbdbd'
  },
  userTime: {
    flex: 1,
    fontSize: 10,
    textAlign: 'left',
    color: '#bdbdbd'
  },
});

export default VideoPlayer;
