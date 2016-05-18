'use strict';

import React from 'react-native';
const {
  StyleSheet,
  ListView,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  PropTypes,
  InteractionManager,
  ProgressBarAndroid,
  Image,
  Dimensions,
  View,
  NativeModules
} = React;
import LoadingView from './components/LoadingView';
import {fetchMovies,fetchNodes} from './actions/read';
import ReadingTabBar from './components/ReadingTabBar';
import ReadingToolbar from './components/ReadingToolbar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {ToastShort} from './utils/ToastUtils';
import Storage from './utils/Storage';
import {CATEGORIES} from './constants/Alias';
import VideoContainer from './containers/VideoContainer';

import TabBar from 'react-native-xtabbar';
var Recommend = require('./Recommend/Recommend');
var Topic = require('./Topic/Topic');
var MyEvent = require('./Event/MyEvent');
var Mine = require('./Mine/Mine');
var Vip = require('./Vip/Vip');

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  read: PropTypes.object.isRequired
}
var _typeIds = [0, 1, 2, 3];
var page = 1;
var loadMoreTime = 0;

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      activeTab: 0,
    };

    //this.onPress = this.onPress.bind(this);
    
    // NativeModules.NetworkModule.getNetworkType((type) => {
    //      //console.log('NetworkType = ' + type);
    // });
  }

  componentDidMount() {
    const {dispatch} = this.props;
    //InteractionManager.runAfterInteractions(() => {
    //    dispatch(fetchNodes(false, true, '70006372'));
    //});
  }

  componentWillReceiveProps(nextProps) {
    const {read} = this.props;
    if (/*read.isLoadMore && !nextProps.read.isLoadMore &&*/ !nextProps.read.isRefreshing) {
      if (nextProps.read.noMore) {
        ToastShort('没有更多数据了');
      };
    }
  }
  
  render() {
    const {read, navigator} = this.props;
    return (
        <View style={styles.container}>
          <TouchableOpacity>
            <ReadingToolbar
              navigator={navigator}
              logo={require('./img/logo.png')}
            />
          </TouchableOpacity>
          <TabBar>
            <TabBar.Item
              icon={require('./img/recommend_not_choose.png')}
              selectedIcon={require('./img/recommend_choose.png')}
              onPress={() => {console.log("first onPress");}}
              title='推荐'>
              <Recommend navigator={navigator}/>
            </TabBar.Item>
          
            <TabBar.Item 
              icon={require('./img/vip_not_choose.png')}
              selectedIcon={require('./img/vip_choose.png')}
              onPress={() => {console.log("first onPress");}}
              title='话题'>
              <Topic/>
            </TabBar.Item>
            
            <TabBar.Item 
              icon={require('./img/event_not_choose.png')}
              selectedIcon={require('./img/event_choose.png')}
              onPress={() => {console.log("first onPress");}}
              title='活动'>
              <MyEvent/>
            </TabBar.Item>
            
            <TabBar.Item 
              icon={require('./img/mine_not_choose.png')}
              selectedIcon={require('./img/mine_choose.png')}
              onPress={() => {console.log("first onPress");}}
              title='我的'>
              <Mine/>
            </TabBar.Item>
            
            <TabBar.Item 
              icon={require('./img/vip_not_choose.png')}
              selectedIcon={require('./img/vip_choose.png')}
              onPress={() => {console.log("first onPress");}}
              title='vip会员'>
              <Vip/>
            </TabBar.Item>
		      </TabBar>
        </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
})

Main.propTypes = propTypes;

export default Main;