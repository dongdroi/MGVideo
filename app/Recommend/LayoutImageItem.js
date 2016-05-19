/**
*独立的每张图片的布局，包括显示vip，免费和信息
*/
'use strict';
var React 		= require('react-native');
var MyImage 	= require('../Widgets/MyImage');
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
		marginTop: 4,
		marginBottom:commonTools.myActualWidth (0),
	},
	nameTextAndroid:
	{
		//fontSize:commonTools.myActualWidth (26),
		fontSize: 12,
		color:commonColor.nameText,
		// height:commonTools.myActualHeight (28),
		marginTop: 4,
		marginLeft: 8,
	},
	longNameTextAndroid:
	{
		//fontSize:commonTools.myActualWidth (20),
		fontSize: 10,
		color:commonColor.longNameText,
		//paddingTop:commonTools.myActualWidth (5),
		// height:commonTools.myActualHeight (28),
		marginTop: 4,
		marginLeft: 8,
	},
	nameText:
	{
		fontSize:commonTools.myActualWidth (26),
		color:commonColor.nameText,
		//height:commonTools.myActualHeight (28),
	},
	longNameText:
	{
		fontSize:commonTools.myActualWidth (20),
		color:commonColor.longNameText,
		paddingTop:commonTools.myActualWidth (5),
		//height:commonTools.myActualHeight (28),
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
			longname:false,
		  };
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
		var data 	= this.props.data;
		if (data)
		{
			var src 	= commonTools.getImageUrlForLayoutImageItem (data, this.props.width, this.props.height);
			return (
				<TouchableOpacity 
					key 	= {this.props.key} 
					style	= {Style.container} 
					onPress	= {() => this.onPressItem ()}>
					<MyImage 
						uri			= {src}
			 	 		height 		= {commonTools.myActualHeight (this.props.height)}
			 	 	   	width 		= {commonTools.myActualWidth (this.props.width)}
			    		isVip 		= {false}
			 			isFree 		= {false}
						showInfo 	= {this.props.showInfo}
			 			info 		= {data.fields.NODEID}/>
					
						<Text 
							style 			= {Platform.OS == "android" ?(Style.nameTextAndroid):(Style.nameText)}
							numberOfLines 	= {1}>
							{data.name}
						</Text>
						{
							this.props.longname ? (
		 					<Text 
								style 			= {Platform.OS == "android" ?(Style.longNameTextAndroid):(Style.longNameText)}
								numberOfLines 	= {1}>
		 						{data.fields.LONG_NAME}
		 					</Text>):
							(null)	
						}
				</TouchableOpacity>
			);
		}
		else 
		{
			return (<View/>);
		}
		
	},

});
