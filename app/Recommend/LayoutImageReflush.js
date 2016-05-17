'use strict';
var React 			= require('react-native');
var LayoutImageItem = require('./LayoutImageItem');
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
		backgroundColor:'white',
		marginBottom:commonTools.myActualWidth(0),
		marginTop:commonTools.myActualWidth(0),
		padding:0,
		margin:0,
	},
	//通用横向布局
	horizontalView:
	{
		flexDirection: 'row',
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
	
	//底部的按钮区域
	bottomView:
	{
		flexDirection: 'row',
		width:commonTools.screenWidth,
		height:commonTools.myActualHeight(50),
      	justifyContent: 'center',
      	alignItems: 'center',
		backgroundColor:commonColor.bottomView,
	},
	//底部的按钮
	bottomTouch:
	{
		flex:1,
		flexDirection: 'row',
      	justifyContent: 'center',
      	alignItems: 'center',
	},
	//底部按钮的文字
	bottomButtonColor:
	{
		color:commonColor.bottomButtonColor, 
		fontSize:12,
	},
	//底部的间隔
	bottomGap:
	{
		backgroundColor:commonColor.bottomGap, 
		width:1, 
		height:commonTools.myActualHeight(30),
	}
});

var index 		= 0;//筛选开始值
var needReflush = true;
module.exports 	= React.createClass	(
{

	shouldComponentUpdate: function (nextProps, nextState) 
	{
		if (!needReflush) 
		{
			  return false;
		}
		needReflush = false;
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
	randomIndex:function ()
	{
		var data 		= this.props.data;
		var newIndex 	= index;
		var time 		= 10;
		while (newIndex == index && time > 0)
		{
			newIndex 	= (parseInt ((Math.random ()*10000))) % data.length;
			time --;
		}
		return newIndex;
		
	},
	onPressMore:function ()
	{
		
	},
	onPressReflush:function ()
	{
		index 	= this.randomIndex();
		needReflush = true;
		this.setState ({null});
		// this.forceUpdate ();
	},
	
	renderBottomView: function ()
	{
		var buttonChild 	= new Array();
		buttonChild.push (
			<TouchableOpacity 
				key		= {0} 
				style	= {Style.bottomTouch} 
				onPress	= {() => this.onPressMore()}>
				<Text 
					style 	= {Style.bottomButtonColor}>
					更多
				</Text>
				<Text 
					style 	= {Style.bottomButtonColor}>
					{this.props.needTitle?(this.props.fatherData.name):("热门直播")}
				</Text>
			</TouchableOpacity>
		);
		buttonChild.push (
			<View 
				key		= {1} 
				style	= {Style.bottomGap}>
			</View>
		);
		buttonChild.push (
			<TouchableOpacity 
				key		= {2} 
				style	= {Style.bottomTouch} 
				onPress	= {() => this.onPressReflush()}>
				<Text 
					style 	= {Style.bottomButtonColor}>
					换一批
				</Text>
			</TouchableOpacity>
		);
		return (
			<View style={Style.bottomView}>
				{buttonChild}
			</View>
		);
		// return buttonChild;
	},
	
	//标题栏
	renderTitleView: function ()
	{
		var titleChild = new Array();
		if (this.props.needTitle)
		{
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
		}
		return (
			<View style={Style.titleView}>
				{titleChild}
			</View>
		);
	},
	
	renderContent: function ()
	{
		var data 	= this.props.data;
		var child 	= new Array ();
		for (var i = 0; i < this.props.count; i ++)
		{
			var start 	= index + i;
			if (start >= data.length) start 	= start%data.length;
			
			child.push (
				<LayoutImageItem
					key			= {i}
					width 		= {this.props.width}
					height 		= {this.props.height}
					data 		= {data[start]}
					onClick 	= {this.onPressItem}
					longname 	= {this.props.value==3 ? (false):(true)}>
				</LayoutImageItem>
			);
		}
		
		var size 		= this.props.value == 5 ? (2):(this.props.value);
		var children 	= new Array ();
		for (var i = 0; i < child.length; i += size)
		{
			var newChild 	= new Array ();
			if (i + (size-1) < child.length)
			{
				for (var j = 0; j < size; j ++)
				{
					newChild.push (child[i+j]);
				}
				children.push (
					<View 
						key		= {i} 
						style 	= {Style.horizontalView}>
						{newChild}
					</View>
				);
			}
		}
		return (
			<View>
			{
				children
			}
			</View>
		);
	},
	
	render: function ()
	{
		if (this.props.data)
		{
			
			return (
				<View style={Style.container}>
					{
						this.renderTitleView ()
					}
					{
						this.renderContent()
					}
					{
						this.renderBottomView ()
					}
				</View>
			);
		}
		return(
			<View/>
		);
		
	},

});
