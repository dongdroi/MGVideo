'use strict';

import React from 'react-native';
const {
	Image,
	Text,
	View,
	PropTypes,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	InteractionManager,
} = React;
import StyleSheetPropType from 'StyleSheetPropType';
import ViewStylePropTypes from 'ViewStylePropTypes';

import ReadingTabBar from '../components/ReadingTabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';

let ViewStylePropType = StyleSheetPropType(ViewStylePropTypes);

const defaultPadding = 10;
const default_days = 8;
const default_height = default_days * 64;
const playBillTabs = ['节目单', '聊天室'];
const billDayNames = ['明天', '今天', '昨天'];

const propTypes = {
	onVideoSelected: PropTypes.func,
	style: ViewStylePropType,
  	programId: PropTypes.string,
	videoPath: PropTypes.string,
 	playBill: PropTypes.array,
};

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

var todayStr = new Date().format('yyyyMMdd');

function formatBillDate(index, playDay) {
    if (index < 3) {
      return billDayNames[index];
    } else {
      var day = playDay.substring(6);      //日
      var month = playDay.substring(4,6);  //月
      return month + '月' + day + '日';
    }
}

function findPlaybackTime(videoPath) {
	var playback = [];
    var index = videoPath.indexOf('playbackbegin');
	playback.push(videoPath.substring(index + 14, index + 14 + 14));
	index = videoPath.indexOf('playbackend');
	playback.push(videoPath.substring(index + 12, index + 12 + 14));
	return playback;
}

//直播节目布局
class PlayBillLayout extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			dayIndex: 1,    //默认显示'今天'节目菜单
		};
		this.onDateItemClicked = this.onDateItemClicked.bind(this);
	}
    
	shouldComponentUpdate(nextProps, nextState) {
    	//console.log('PlayBillLayout shouldComponentUpdate');
		if (this.props.programId == nextProps.programId && 
			this.props.videoPath == nextProps.videoPath && this.state.dayIndex == nextState.dayIndex) {
			  return false;
		}
		return true;
	}
  
  	onDateItemClicked(dayIndex) {
    	//console.log('onItemClicked dayIndex = ' + dayIndex);
    	this.setState({dayIndex: dayIndex});
  	}
 	
  	renderContent(tab) {
		var playBill = this.props.playBill;  	//节目单数组
		var videoPath = this.props.videoPath;   //当前播放的视频链接
		if (tab == '节目单' && playBill != undefined) {
		var todayIndex;
		for (var i = playBill.length - 1; i >= 0; i--) {
			if (playBill[i].PlayDay == todayStr) {
				todayIndex = i;
				break;
			}
		}
		var dateListView = [];
		var startIndex = todayIndex + 1;
		var endIndex = startIndex - default_days;
		var dayIndex = 0;
		for (var i = startIndex; i > endIndex ; i--) {
			var dateText = formatBillDate(dayIndex, playBill[i].PlayDay);
			var isSelected = dayIndex == this.state.dayIndex;
			dateListView.push(
				<TouchableOpacity key={i} style={{flex:1, flexDirection:'column', justifyContent:'center', 
					alignItems:'center', height:64, borderBottomWidth: 0.5, borderBottomColor:'#f0f0f0',
					backgroundColor:isSelected ? '#ff8f00':'transparent'}}
					onPress={this.onDateItemClicked.bind(this, dayIndex)}>
					<Text style={{fontSize:12, color:isSelected ? 'white': '#adadad'}}>{dateText}</Text>
					{
					(dayIndex++ > 3) ? (<Text style={{fontSize:8, color:'#ff8f00'}}>(会员独享)</Text>):(null)
					}
				</TouchableOpacity>
			);
		}
		var billListView = [];
		var billIndex = todayIndex + (1 - this.state.dayIndex);
		var playLists = playBill[billIndex].PlayLists.Play;
		var playLength = playLists.length;
		var currentTime = new Date();
		var highLight = false;
		var stateText = '';
		
		var playback;
		if (videoPath.indexOf('playback') > 0) {
			playback = findPlaybackTime(videoPath);
		}
	    
		for (var i = 0; i < playLength; i++) {
			var play = playLists[i];
		  	var startTime = new Date(Date.parse((play.StartTime + ':00').replace(/\-/g,'/')));
			var endTime = new Date(Date.parse((play.EndTime + ':00').replace(/\-/g,'/')));
			
			if (currentTime < startTime) { 										//预约								
 				stateText = '预约';
			} else if(currentTime >= startTime && currentTime <= endTime) {	    //正在播放
				highLight = true;
				stateText = '播放中';
			} else {															//回看
				stateText = '回看';
			}
			
			//点击回看视频，高亮显示
			if (playback != undefined && playback[0] == startTime.format('yyyyMMddhhmmss')
				&& playback[1] == endTime.format('yyyyMMddhhmmss')) {
				highLight = true;
			}
			
			billListView.push(
				<TouchableOpacity key={i} style={{flex:1, flexDirection:'row', justifyContent:'center', 
					height:64, borderBottomWidth: 0.5, borderBottomColor:'#f0f0f0'}}
					onPress={this.props.onBillItemClicked.bind(this, startTime, endTime)}>
					<View style={{flex: 6, flexDirection:'column', justifyContent:'center'}}>
						<Text style={{fontSize:12, color:(highLight ? '#ff8f00':'#3c3c3c')}}>{play.PlayName}</Text>
						<Text style={{fontSize:10, color:(highLight ? '#ff8f00':'#adadad'), marginTop: 2}}>{play.StartTime.substring(11)}</Text>
					</View>
					<View style={{flex: 1, flexDirection:'column', justifyContent:'center', alignItems:'flex-start'}}>
						<Text style={{fontSize:10, color:'#ff8f00'}}>{stateText}</Text>
					</View>
				</TouchableOpacity>
			);
		}
		return (
			<View style={{flex: 1, flexDirection: 'row'}}>
				<View style={{flex:1, flexDirection: 'column',
					backgroundColor:'#fcfcfc', borderRightWidth:0.5, borderRightColor:'#f0f0f0'}}>
					<ScrollView
					automaticallyAdjustContentInsets={false}
					horizontal={false}
					showsVerticalScrollIndicator={false}>
					{dateListView}
					</ScrollView>
				</View>
				<View style={{flex:4, flexDirection:'column',
					paddingLeft: defaultPadding, paddingRight: defaultPadding}}>
					<ScrollView
					automaticallyAdjustContentInsets={false}
					horizontal={false}
					showsVerticalScrollIndicator={false}>
					{billListView}
					</ScrollView>
				</View>
			</View>
		);
		}
  	}
  
	render() {
		console.log('PlayBillLayout renderxxxxxxxxxxxxxxxxxxxxx' + this.props);
		var playBillList = [];
		playBillTabs.forEach((tab) => {
			playBillList.push(
				<View key={tab} tabLabel={tab} style={{flex: 1}}>
				{this.renderContent(tab)}  
				</View>);
		});
		return (
			<View style={{flex:1, flexDirection:'column', marginTop:8}}>
				<ScrollableTabView
					renderTabBar={() => <ReadingTabBar/>}
					tabBarBackgroundColor="#fcfcfc"
					tabBarUnderlineColor="#ff8f00"
					tabBarActiveTextColor="#ff8f00"
					tabBarInactiveTextColor="#3c3c3c">
					{playBillList}
				</ScrollableTabView>
			</View>  
		);
	}
}

let styles = StyleSheet.create({
     
})

PlayBillLayout.propTypes = propTypes;
 
export default PlayBillLayout;