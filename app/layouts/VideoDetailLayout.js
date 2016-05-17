'use strict';

import React from 'react-native';
const {
	Image,
	Text,
	View,
	PropTypes,
	TouchableOpacity,
	StyleSheet,
} = React;
import StyleSheetPropType from 'StyleSheetPropType';
import ViewStylePropTypes from 'ViewStylePropTypes';

let ViewStylePropType = StyleSheetPropType(ViewStylePropTypes);

const propTypes = {
	style: ViewStylePropType,
  detail: PropTypes.object,
  programId: PropTypes.string,
};

//视频详细信息（名称，主演等）布局
class VideoDetailLayout extends React.Component {
	constructor(props) {
		super(props);
    
    this.state = {
      isDescriptionShow: true,    //详细信息
    };
    
    this.onPress = this.onPress.bind(this);
	}
    
	shouldComponentUpdate(nextProps, nextState) {
    //console.log('VideoDetail shouldComponentUpdate ' + this.props.programId + ',' + nextProps.programId);
    if (this.props.programId == nextProps.programId &&
        this.state.isDescriptionShow == nextState.isDescriptionShow) {
      return false;
    }
		return true;
	}
	
  onPress() {
    var show = !this.state.isDescriptionShow;
    this.setState({isDescriptionShow: show});
  }
  
	render() {
		//console.log('VideoDetail renderxxxxxxxxxxxxxxxxxxxxxxxxx');
    var lists = [];
    if (this.props.detail.director != undefined) {
        lists.push(
          <View key={0} style={styles.videoSub}>
            <Text style={styles.videoSubKey}>导演：</Text>
            <Text style={styles.videoSubValue}>{this.props.detail.director}</Text>
          </View>);
    }
    if (this.props.detail.mainActor != undefined) {
        lists.push(
          <View key={1} style={styles.videoSub}>
              <Text style={styles.videoSubKey}>演员：</Text>
              <Text style={styles.videoSubValue} numberOfLines={2}>{this.props.detail.mainActor}</Text>
          </View>);
    }
    if (this.props.detail.description != undefined && this.state.isDescriptionShow) {
        lists.push(
          <Text key={2} style={[styles.videoSubKey, {marginTop: 4}]} 
            numberOfLines={8}>{this.props.detail.description}
          </Text>);
    }
		return (
        <View style={this.props.style}>
          <View style={styles.videoSub}>
            <Text style={styles.videoTitle} numberOfLines={1}>{this.props.detail.name}</Text>
            <TouchableOpacity style={styles.videoPop} onPress={this.onPress}>
              <Image style={{width: 18, height: 18, resizeMode: Image.resizeMode.contain}}
                  source={this.state.isDescriptionShow ? require('../img/ic_video_down.png') 
                    : require('../img/ic_video_up.png')}></Image>
            </TouchableOpacity>
          </View>
          {lists}
        </View>
		);
	}
}

let styles = StyleSheet.create({
  videoTitle: {
    flex: 6,
    fontSize: 14,
    textAlign: 'left',
    color: 'black'
  },
  videoPop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  videoSub: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  videoSubKey: {
    fontSize: 12,
    textAlign: 'left',
    color: '#bdbdbd',
  },
  videoSubValue: {
    fontSize: 12,
    textAlign: 'left',
    color: '#ff8f00',
  },
})

VideoDetailLayout.propTypes = propTypes;
 
export default VideoDetailLayout;