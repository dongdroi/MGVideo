'use strict';

import React from 'react-native';
const {
  	View,
  	Text,
  	Image,
  	Component,
  	StyleSheet,
	Platform,
  	TouchableOpacity,
} = React;

import {NaviGoBack} from '../utils/CommonUtils';
import ReadingToolbar from '../components/ReadingToolbar';

var Category;

class ChannelContainer extends Component {
  constructor(props) {
    super(props);
	
    Category = this.props.route.data;
	
    this.onPress = this.onPress.bind(this);
  }
  
  onPress() {
    console.log('navigator = ' + this.props.navigator);
    return NaviGoBack(this.props.navigator);
  }
  
  renderRowItem(item, i) {
     return(
       <View key={i} style={{flexDirection:'row', alignItems: 'center', height: 48, borderBottomWidth:0.5, borderBottomColor:'#f0f0f0'}}>
            <TouchableOpacity style={{flex: 1}}>
                <Text style={{textAlign: 'center', fontSize: 14, color: 'black'}}>{item[0]}</Text>
            </TouchableOpacity>
            <View style={{width: 0.5, height: 32, backgroundColor:'#f0f0f0'}}></View>
            <TouchableOpacity style={{flex: 1}}>
              <Text style={{textAlign: 'center', fontSize: 14, color: 'black'}}>{item[1]}</Text>
            </TouchableOpacity>
       </View>
     );
  }
  
  render() {
    return (
          <View style={styles.container}>
              <View style={{flexDirection:'row', alignItems: 'center', height: 35, backgroundColor:'white'}}>
                
                <View style={{position:'absolute', top: 0, left: 0, right:0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{fontSize:16, color:'black',fontWeight:'bold'}}>频道</Text>
                </View>
		
                <TouchableOpacity onPress={this.onPress} style={{position:'absolute', left: 8, alignItems: 'center',justifyContent: 'center' }}>
                  <Image style={{ width:32, height: 32}} source={require('../img/ic_back_btn.png')}></Image>
                </TouchableOpacity>
		
              </View>

              <View style={{flexDirection:'column', marginTop: 8, backgroundColor:'white'}}>
                  {Category.map((item, i) => this.renderRowItem(item, i))}
              </View>
          </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f0f0f0',
	  marginTop:(Platform.OS == 'android'?(0):(20)),
  },
})

export default ChannelContainer;