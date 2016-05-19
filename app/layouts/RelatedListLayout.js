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
  	programId: PropTypes.string,
  	nodeRelated: PropTypes.array,
};
//综艺选集布局
class RelatedListLayout extends React.Component {
	constructor(props) {
		super(props);
	}
    
	shouldComponentUpdate(nextProps, nextState) {
    //console.log('RelatedListLayout shouldComponentUpdate');
	  if (this.props.programId == nextProps.programId /*&& 
        this.props.nodeRelated.length == nextProps.nodeRelated.length*/) {
			  return false;
		}
		return true;
	}
  
	render() {
		//console.log('RelatedListLayout renderxxxxxxxxxxxxxxxxxxxxx' + this.props);
    var serialLists = [];
    var nodeRelated = this.props.nodeRelated;
    nodeRelated.forEach((node) => {
        var imageUri = node.fields.displayFileLists.displayFile[1].dpFileName;
        serialLists.push(
            <TouchableOpacity key={node._id} style={{flexDirection: 'row', marginTop: 16}}
                onPress={this.props.onVideoSelected.bind(this, node._id)}>
                <Image style={{flex: 3, height: 80}} source={{uri: imageUri}}></Image>
                <Text style={{flex: 4, marginLeft: 8, fontSize:13, color:'gray'}}>{node.fields.Name}</Text>
            </TouchableOpacity>
        );  
    });
		return (
	       <View style={this.props.style}>
            <View style={{height: 0.5, backgroundColor:'#e0e0e0'}}></View>
              <Text style={{fontSize:14, color:'black', textAlign:'left', marginTop:8}}>选集</Text>
              {serialLists}
          </View>   
		);
	}
}

let styles = StyleSheet.create({
     
})

RelatedListLayout.propTypes = propTypes;
 
export default RelatedListLayout;