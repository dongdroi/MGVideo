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
		justifyContent: 'center',
		alignItems: 'center',
	},
	
	nameSize:
	{
		fontSize:commonTools.myActualWidth(25),
		marginTop:commonTools.myActualWidth(5),
		marginBottom:commonTools.myActualWidth(5),
		color:"black",
	},
	hotSize:
	{
		fontSize:commonTools.myActualWidth(20),
		marginTop:commonTools.myActualWidth(5),
		marginBottom:commonTools.myActualWidth(5),
		color:"red",
	},
	icon:
	{
    	position: 'absolute',
    	right: commonTools.myActualWidth(5),
    	bottom: commonTools.myActualWidth(5),
		width:commonTools.myActualWidth(80),
		height:commonTools.myActualWidth(80),
	}
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
		if (this.props.onClick)
		{
			this.props.onClick (this.props.data);
		}
	},
	
	render: function ()
	{
		var hot 	= "人气值："+10;
		var src 	= commonTools.getImageUrlForLayoutImageItemForLive (this.props.data);
		return (
			<TouchableOpacity 
				style	= {Style.container} 
				onPress	= {() => this.onPressItem ()}>
				<Image 
					style = {{
							width: commonTools.myActualWidth(this.props.width), 
							height: commonTools.myActualHeight(this.props.height), 
							backgroundColor: 'transparent'}}
	            	source 	= {{uri: src}}>
					<Image
						style = {Style.icon}
						source 	= {require ('../img/live_revolve.png')}></Image>
				</Image>
				<Text style 		= {Style.nameSize}
					  numberOfLines = {1}>
						{this.props.data.name}
				</Text>
				{
					this.props.showHot ? 
					(
						<Text style 		= {Style.hotSize}
							  numberOfLines = {1}>
								{hot}
						</Text>
					):
					(null)
				}
			</TouchableOpacity>
		);
		
	},
});
