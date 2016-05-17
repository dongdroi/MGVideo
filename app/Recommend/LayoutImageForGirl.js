'use strict';
var React 			= require('react-native');
var LayoutImageItemForGirl 		= require ('./LayoutImageItemForGirl');
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
	horizontalView:
	{
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	//超女直通区域下面的内容
	titleView:
	{
		flexDirection: 'row',
		width:commonTools.screenWidth,
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
		color:"red",
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
	onClickTitle: function ()
	{
		if (this.props.onClickTitle)
		{
			if (this.props.fatherData.PROGRAM_ID == "" || 
				this.props.fatherData.PROGRAM_ID.length <= 0)
			{
				this.props.fatherData.PROGRAM_ID = this.props.fatherData.nodeId;
			}
			this.props.onClickTitle (this.props.fatherData);
		}
	},
	onCilckItem:function (data)
	{
		if (this.props.onClick)
		{
			this.props.onClick(data);
		}
	},
	
	//标题栏
	renderTitleViewForGirl: function ()
	{
		var titleChild = new Array();
		titleChild.push(
			<Image
				key 	= {0}
				source	= {require ('../img/live_revolve.png')}
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
		titleChild.push (
			<TouchableOpacity
				key 	= {3}
				style	= {Style.horizontalView}
				onPress	= {() => this.onClickTitle()}>
				<Text
					style 	= {Style.titleCommon}>
					查看全部
				</Text>
				<Text
					style 	= {Style.titleCommon}>
					>
				</Text>
			</TouchableOpacity>
		);
		return (
			<View style = {Style.titleView}>
				{titleChild}
			</View>
		);
	},
	

	
	renderChild:function()
	{
		var children = new Array ();


		var showHot = this.props.value == 7?(true):(false)
		var count 	= this.props.showCount;
		if (count > this.props.data.length)
		{
			count 	= this.props.data.length;
		}
		for (var i = 0; i < count; i += 2)
		{
			if (i + 1 < count)
			{
				children.push (
					<View 	key 	= {i}
							style 	= {[Style.horizontalView, {marginBottom:5}]}>
						<LayoutImageItemForGirl
							data 		= {this.props.data[i]}
							onClick 	= {this.onCilckItem}
							width 		= {this.props.width}
							height 		= {this.props.height}
							showHot 	= {this.props.showHot}
							style 		= {{flex:1}}>
						</LayoutImageItemForGirl>
						<LayoutImageItemForGirl
							data 		= {this.props.data[i+1]}
							onClick 	= {this.onCilckItem}
							width 		= {this.props.width}
							height 		= {this.props.height}
							showHot 	= {this.props.showHot}
							style 		= {{flex:1}}>
						</LayoutImageItemForGirl>
					</View>
				);
			}
		}
		return (
			<View>
				{children}
			</View>
		);
	},
	render: function ()
	{
		return (
			<View>
				{this.renderTitleViewForGirl ()}
				{this.renderChild ()}
			</View>
		);
		
	},

});
