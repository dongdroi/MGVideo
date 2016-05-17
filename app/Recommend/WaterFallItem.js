'use strict';
var React 			= require('react-native');
var WaterFallItem 	= require ('./WaterFallItem');
var {
	Text,
	TouchableOpacity,
	View,
	ListView,
	Image,
	PropTypes,
	ScrollView,
} = React;

import header, {
  commonStyles,
  commonColor,
  commonTools,
} from '../header'


var Style = React.StyleSheet.create(
{
    container: 
	{
    },
	infoStyle:
	{
		fontSize:12,
		margin: 0, 
		paddingTop:0,
		paddingBottom:0,
		paddingLeft:3,
		paddingRight:3,
		backgroundColor: '#000000',
		opacity:0.8,
		color: 'white'
	},
});

module.exports = React.createClass (
{
	shouldComponentUpdate: function (nextProps, nextState) 
	{
		if (this.props.data == nextProps.data) 
		{
			  return false;
		}
		return true;
	},
	onClick:function ()
	{
		if (this.props.onClick && this.props.showInfo)
		{
			this.props.onClick (this.props.data);
		}
	},
	
	render:function ()
	{
		var imageUri = commonTools.getImageUrlForWaterFallItem (this.props.data);
		return (
			<TouchableOpacity
				onPress	= {() => this.onClick ()}>
				<Image
					style 	= {{width:this.props.width, height:this.props.height, marginBottom:2}}
					source 	= {{uri: imageUri}}>
					<View style = {{flex:1}}/>
					{
						this.props.showInfo ? 
						(
							<Text 
							style 	= {Style.infoStyle}>
							{this.props.data.name}
							</Text>
						):
						(null)
					}
				</Image>
			</TouchableOpacity>
			
		);
	}
});
