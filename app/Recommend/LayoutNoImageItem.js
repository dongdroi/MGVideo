/**
*在精选里面的没有图片的资讯
*/
'use strict';
var React 		= require('react-native');
var Dimensions 	= require('Dimensions');
var {
	View,
	Text,
	TouchableOpacity,
	PropTypes,
	Platform,
	Image,
} = React;

import header, {
  commonStyles,
  commonColor,
  commonTools,
} from '../header'

var Style 	= React.StyleSheet.create (
{
	container: 
	{
		backgroundColor:'white',
		width:commonTools.screenWidth,
		height:commonTools.myActualHeight(50),
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	nameTextAndroid:
	{
		flex:1,
		fontSize:commonTools.myActualWidth (26),
		color:commonColor.nameText,
	},
	nameText:
	{
		flex:1,
		fontSize:commonTools.myActualWidth (26),
		color:commonColor.nameText,
		height:commonTools.myActualHeight (30),
	},
	iconStyle:
	{
		width:commonTools.myActualWidth(30),
		height:commonTools.myActualWidth(30),
	},
});

module.exports 	= React.createClass (
{
	shouldComponentUpdate: function (nextProps, nextState) 
	{
		if (this.props.data == nextProps.data) 
		{
			  return false;
		}
		return true;
	},

	getInitialState: function ()
	{
		return{
			data: null,
	    	onClick: PropTypes.func,
		  };
	},
	onPressItem:function ()
	{
		if (this.props.onClick)
		{
			this.props.onClick (this.props.data);
		}
	},
	render: function ()
	{
		if (this.props.data)
		{
			return (
				<TouchableOpacity 
					key 	= {this.props.key} 
					style	= {Style.container} 
					onPress	= {() => this.onPressItem ()}>
						<Image
							source 	= {require ('../img/featured_play.png')}
							style 	= {Style.iconStyle}></Image>
						<Text 
							style 	= {Platform.OS == "android" ?(Style.nameTextAndroid):(Style.nameText)}
							numberOfLines = {1}>
							{this.props.data.name}
						</Text>
				</TouchableOpacity>
			);
		}
		else 
		{
			return (<View/>);
		}
		
	},

});
