/**
*直播下面的今日热门直播选项
*/
var React 		= require('react-native');
var {
	View,
	Text,
	TouchableOpacity,
	PropTypes,
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
		width:commonTools.screenWidth,
		justifyContent: 'center',
		alignItems: 'center',
	},
	topView:
	{
		flex:1,
		flexDirection:'row',
		width:commonTools.screenWidth,
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft:commonTools.myActualWidth(20),
		paddingRight:commonTools.myActualWidth(20),
	},
	bottomView:
	{
		flex:1,
		marginLeft:commonTools.myActualWidth(200),
		marginRight:commonTools.myActualWidth(50),
		backgroundColor:"grey", 
		height:1,
	},
	imageStyle:
	{
		width:commonTools.myActualWidth(130),
		height:commonTools.myActualHeight(70),
		marginRight:commonTools.myActualWidth(50),
	},
	textStyle:
	{
		flex:1,
		color:"black", 
		fontSize:14,
	},
	rightTextStyle:
	{
		color:"orange", 
		fontSize:14,
		marginRight:commonTools.myActualWidth(60),
	},
	iconStyle:
	{
		width:commonTools.myActualWidth(45),
		height:commonTools.myActualWidth(45),
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
	onPressItem:function ()
	{
		var data 	= this.props.data;
		if (this.props.onClick)
		{
			this.props.onClick (data);
		}
	},
	
	render: function ()
	{
		if (this.props.data)
		{
			var src 	= commonTools.getImageUrlForLayoutImageItemForLive (this.props.data);
			return (
				<View>
			<TouchableOpacity 
				style	= {Style.container} 
				onPress	= {() => this.onPressItem ()}>
				<View
					style 	= {Style.topView}>
					<Image
        				style={Style.imageStyle}
        				source={{uri: src}}>
					</Image>
					<Text
						style={Style.textStyle}>
						{this.props.data.name}
					</Text>
					<Image
						source 	= {require ('../img/live_revolve.png')}
						style 	= {Style.iconStyle}></Image>
					<Text
						style={Style.rightTextStyle}>
						回看
					</Text>
				</View>
			</TouchableOpacity>
				<View
					style 	= {Style.bottomView}>
				</View>
				</View>
				
			);
		}
		else 
		{
			return (<View/>);
		}
		
	},
});
