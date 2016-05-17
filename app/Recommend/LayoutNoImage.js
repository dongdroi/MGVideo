'use strict';
var React 			= require('react-native');
var LayoutNoImageItem = require('./LayoutNoImageItem');
var 
{
	View,
	Text,
	TouchableOpacity,
	PropTypes,
	Image,
} = React;

import header, 
{
  commonStyles,
  commonColor,
  commonTools,
} from '../header'

var Style 	= React.StyleSheet.create (
{
	container: 
	{
		flex:1,
		width:commonTools.screenWidth,
	},
	//通用横向布局
	horizontalView:
	{
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	
	//标题栏
	titleView:
	{
		flexDirection: 'row',
		width:commonTools.screenWidth,
		padding:commonTools.myActualWidth(10),
		justifyContent: 'center',
		alignItems: 'center',
	},
	//标题栏图标
	titleIcon:
	{
		width:commonTools.myActualWidth(30), 
		height:commonTools.myActualWidth(30),
		marginRight:commonTools.myActualWidth(13),
	},
	//标题栏名称
	titleName:
	{
		fontSize:13,
	},
	//标题栏中间空的区域
	titleEmpty:
	{
		flex:1
	},
	//标题栏最右内容
	titleCommon:
	{
		fontSize:11,
		color:commonColor.titleCommon,
	},
});

module.exports 	= React.createClass	(
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
		return {
			data: null,
	    	onClick: PropTypes.func,
		};
	},
	onPressItem:function (data)
	{
		if (this.props.onClick)
		{
			this.props.onClick (data);
		}
	},
	
	onPressTitleCommon:function()
	{
		if (this.props.onClickTitle)
		{
			this.props.onClickTitle (this.props.fatherData);
		}
	},
	//标题栏
	renderTitleView: function ()
	{
		var titleChild = new Array();
		titleChild.push(
			<Image
				key 	= {0}
				source	= {{uri: this.props.fatherData.src}}
				style	= {Style.titleIcon}>
			</Image>
		);
		
		titleChild.push(
			<Text 
				key		= {1}
				style	={Style.titleName}>
				{this.props.fatherData.name}
			</Text>
		);
		
		titleChild.push (
			<View
				key 	= {2}
				style 	= {Style.titleEmpty}>
			</View>
		);
	
		// titleChild.push (
		// 	<Text
		// 		key 	= {3}
		// 		style 	= {Style.titleCommon}>
		// 		{this.props.fatherData.commonStyle}
		// 	</Text>
		// );
		// titleChild.push (
		// 	<Text
		// 		key 	= {4}
		// 		style 	= {Style.titleCommon}>
		// 		>
		// 	</Text>
		// );
		
		titleChild.push (
			<TouchableOpacity 
				key 	= {3} 
				style	= {Style.horizontalView} 
				onPress	= {() => this.onPressTitleCommon ()}>
				<Text
					style 	= {Style.titleCommon}>
					{this.props.fatherData.commonStyle}
				</Text>
				<Text
					style 	= {Style.titleCommon}>
					>
				</Text>
			</TouchableOpacity>
		);
	
		return titleChild;
	},
	
	renderContent: function ()
	{
		var children 	= new Array ();
		for (var i = 0; i < this.props.count; i ++)
		{
			children.push (
				<LayoutNoImageItem
					key			= {i}
					data 		= {this.props.data[i]}
					onClick 	= {this.onPressItem}>
				</LayoutNoImageItem>
			);

		}
		
		return children;
	},
	
	render: function ()
	{
		if (this.props.data)
		{
			var contentChild 	= this.renderContent ();
			var titleChild 		= this.renderTitleView ();
			
			return (
				<View style={Style.container}>
					<View style={Style.titleView}>
						{titleChild}
					</View>
					{contentChild}
				</View>
			);
		}
		return(
			<View>
			</View>
		);
		
	},

});
