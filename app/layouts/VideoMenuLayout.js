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
	videoMarked: PropTypes.bool,
	onSharePress: PropTypes.func,
	onMarkPress: PropTypes.func,
	onDownloadPress: PropTypes.func,
	style: ViewStylePropType,
	times: PropTypes.string,
};

//视频播放量，收藏，下载栏布局
class VideoMenuLayout extends React.Component {
	constructor(props) {
		super(props);
	}
    
	shouldComponentUpdate(nextProps, nextState) {
    //console.log('VideoMenu shouldComponentUpdate');
	  if (this.props.times == nextProps.times &&
        this.props.videoMarked == nextProps.videoMarked) {
			return false;
		}
		return true;
	}
	
	render() {
		//console.log('VideoMenu renderxxxxxxxxxxxxxxxxxxxxx' + this.props);
		return (
			<View style={this.props.style}>
          <View style={{flexDirection: 'row', alignItems:'center'}}>
            <Image style={{width: 16, height: 16}}
                source={require('../img/ic_video_count.png')}></Image>
            <Text style={styles.menuFont}>{this.props.times}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', position:'absolute', top: 4, right: 0}}>
            <TouchableOpacity style={styles.menuButton} onPress={this.props.onMarkButtonPress}>
              <View style={{alignItems: 'center',flexDirection: 'column'}}>
                  <Image style={{width: 16, height: 16}}
                    source={this.props.videoMarked ? require('../img/ic_video_mark_selected.png') : 
                            require('../img/ic_video_mark_unselected.png')}></Image>
                  <Text style={this.props.videoMarked ? styles.menuFontSelect : styles.menuFont}>收藏</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={this.props.onShareButtonPress}>
              <View style={{alignItems: 'center',flexDirection: 'column'}}>
                  <Image style={{width: 16, height: 16}}
                    source={require('../img/ic_video_share_unselected.png')}></Image>
                  <Text style={styles.menuFont}>分享</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}>
              <View style={{alignItems: 'center',flexDirection: 'column'}}>
                  <Image style={{width: 16, height: 16}}
                    source={require('../img/ic_video_download.png')}></Image>
                  <Text style={styles.menuFont}>下载</Text>
              </View>
            </TouchableOpacity>
          </View>
      </View>
		);
	}
}

let styles = StyleSheet.create({
  menuFont: {
    fontSize: 10,
    textAlign: 'center',
    color: 'white',
  },
  menuFontSelect: {
    fontSize: 10,
    textAlign: 'center',
    color: '#ff8f00'
  },
  menuButton: {
    alignItems: 'center',
    justifyContent: 'center', 
    marginLeft: 10,
    marginRight: 10,
  }
})

VideoMenuLayout.propTypes = propTypes;
 
export default VideoMenuLayout;