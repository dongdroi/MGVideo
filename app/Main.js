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
  Image,
  Dimensions,
  View,
  NativeModules,
  Platform
} = React;
import LoadingView from './components/LoadingView';
import {fetchMovies,fetchNodes} from './actions/read';
import ReadingTabBar from './components/ReadingTabBar';
import ReadingToolbar from './components/ReadingToolbar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {ToastShort} from './utils/ToastUtils';
import Storage from './utils/Storage';
import {CATEGORIES} from './constants/Alias';
import ChannelContainer from './containers/ChannelContainer';

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

    this.onPressMenuButtonRight = this.onPressMenuButtonRight.bind(this);
    
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
  
  onPressMenuButtonRight() {
    const {navigator} = this.props;
    InteractionManager.runAfterInteractions(() => {
      navigator.push({
        component: ChannelContainer,
        name: 'Channel',
      });
    });
  }
  
  myActualWidth (width) 
  {
    return (
		parseInt (width*Dimensions.get('window').width/750)
    );
  }
  myActualHeight (height) 
  {
    return (
		parseInt (height*Dimensions.get('window').height/1334)
    
    );
  }
  render() {
    const {read, navigator} = this.props;
    var isAndroid = Platform.OS === 'android';
    return (
        <View style={styles.container}>
			    <View style={{marginTop:isAndroid ? 0 : this.myActualHeight(55), flexDirection:'row', alignItems: 'center', height: this.myActualHeight(88), backgroundColor:'white'}}>
              <TouchableOpacity>
                <Image style={{marginLeft: this.myActualWidth(30), width: this.myActualWidth(160), height: this.myActualHeight(40)}} source={require('./img/logo.png')}></Image>
              </TouchableOpacity>
          </View>
          <TabBar>
            <TabBar.Item
              icon={require('./img/recommend_not_choose.png')}
              selectedIcon={require('./img/recommend_choose.png')}
              onPress={() => {console.log("first onPress");}}
              title='推荐'>
              <Recommend navigator={navigator} 
                onPressMenuButtonRight={this.onPressMenuButtonRight}/>
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