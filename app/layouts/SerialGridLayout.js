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
	onVideoSelected: PropTypes.func,
	style: ViewStylePropType,
  serialIds: PropTypes.string,
	serialGap: PropTypes.number,
  serialWidth: PropTypes.number,
  serialHeight: PropTypes.number,
  programId: PropTypes.string,
};

//电视剧剧集格子布局
class SerialGridLayout extends React.Component {
	constructor(props) {
		super(props);
    
    this.state = {
      index: 0,    //播放列表第一页
    };
    this.onItemClicked = this.onItemClicked.bind(this);
	}
    
	shouldComponentUpdate(nextProps, nextState) {
    //console.log('SerialGridLayout shouldComponentUpdate');
	  if (this.props.programId == nextProps.programId 
        && this.state.index == nextState.index) {
			return false;
		}
		return true;
	}
  
  onItemClicked(index) {
    console.log('onItemClicked index = ' + index);
    this.setState({index: index});
  }
	
	render() {
		//console.log('SerialGridLayout renderxxxxxxxxxxxxxxxxxxxxx' + this.props);
    var serialGap = this.props.serialGap;
    var serialWidth = this.props.serialWidth;
    var serialHeight = this.props.serialHeight;
    var serialIds = this.props.serialIds.split(',');
    var programId = this.props.programId;
    const SerialHeight = Math.ceil(serialIds.length / 5 + 1) * (serialHeight + serialGap / 3);
    
    var programs = [];
    if (serialIds != undefined) {
      const length = serialIds.length;
      const count = Math.ceil(length / 25);
      var indices = [];
      for (var i = 0; i < count; i++) {
        var left = i * (serialWidth + serialGap);
        var startIndex = (1 + i * 25);
        var endIndex = startIndex - 1 + (i < (count - 1) ? 25 : (length - i * 25));
        var text = startIndex + '-' + endIndex;
        if (startIndex == endIndex) {
            text = '' + endIndex;
        }
        
        indices.push(startIndex);
        indices.push(endIndex);    //记录起始索引和结束索引
        
        programs.push(
        <TouchableOpacity key={text} style={{alignItems:'center', justifyContent:'center', 
            position:'absolute', top: 0, left: left, width: serialWidth, height: serialHeight}}
            onPress={this.onItemClicked.bind(this, i)}>
           <Text style={{fontSize: 14, color: (i == this.state.index ? '#ff8f00' : '#adadad')}}>{text}</Text>
        </TouchableOpacity>);
      }
      var listIndex = this.state.index * 2;
      var startIndex = indices[listIndex] - 1;
      var endIndex = indices[listIndex + 1];
      for (var i = startIndex; i < endIndex;) {
        var pid = serialIds[i];
        var col = i % 5; 
        var row = Math.floor(i / 5) % 5 + 1;
        var top = row * (serialHeight + serialGap / 3);
        var left = col * (serialWidth + serialGap);
        var isSelected = pid == programId;
        programs.push(
          <TouchableOpacity key={pid} programId={pid} style={{alignItems:'center', justifyContent:'center', position:'absolute', top: top, left: left, 
              width: serialWidth, height: serialHeight, backgroundColor: (isSelected ? 'white' : '#f0f0f0'),
              borderWidth:(isSelected ? 0.5 : 0), borderColor:(isSelected ? '#ff8f00' : 'white') }}
              onPress={this.props.onVideoSelected.bind(this, pid)}>
            <Text style={{fontSize: 14, color: (isSelected ? '#ff8f00' : 'black')}}>{(++i > 9) ? '' + i : '0' + i}</Text>
          </TouchableOpacity>);
       }
    }

		return (
	      <View style={this.props.style}>
          <View style={{height: 0.5, backgroundColor:'#e0e0e0'}}></View>
          <View style={{height: SerialHeight, backgroundColor:'white'}}>
          {programs}
          </View>
        </View>
		);
	}
}

let styles = StyleSheet.create({
     
})

SerialGridLayout.propTypes = propTypes;
 
export default SerialGridLayout;