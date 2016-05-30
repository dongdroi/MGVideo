'use strict';
var React 				= require('react-native');
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar, } from 'react-native-scrollable-tab-view';
var _ScrollableTabBar;
var Config 	= require('../Config/Config');
var MenuListViewPageItem 	= require('./MenuListViewPageItem');
var _MenuListViewPageItems 	= new Array();

var MenuListViewPage 	= require('./MenuListViewPage');
var NodeId 				= "70006350";//推荐栏目id
var menuData 			= new Array();//标题数据源

import LoadingView from '../components/LoadingView';

var {
	Text,
	TouchableOpacity,
	View,
	Platform,
	ListView,
	Image,
} = React;
import header, {
  commonStyles,
  commonColor,
  commonTools,
} from '../header'

var Style = React.StyleSheet.create (
{
	container: 
	{
		backgroundColor: 'white',
		flex:1, 
	},
	topView:
	{
		height:commonTools.myActualHeight(40),
		backgroundColor:'transparent',
	},
	pageView:
	{
		width: commonTools.screenWidth, 
		height: commonTools.myActualPageHeight (),
	},

	pages:
	{
		flex:1,
      	width: commonTools.screenWidth,
      	height: commonTools.myActualPageHeight (),
	},
	
	
	ScrollableTabBar:
	{
		color:"black",
	},
    menuView: 
	{
      	width: commonTools.screenWidth,
      	height: commonTools.actualWidth (35),
	  	flexDirection: 'row',
	  	justifyContent: 'center',
	  	alignItems: 'center',
    },
    menuButton: 
	{
		backgroundColor: 'white',
      	width: commonTools.actualWidth (35),
      	height: commonTools.actualWidth (35),
      	alignItems: 'center',
      	justifyContent: 'center',
    },
	menuButtonView:
	{
		backgroundColor: 'white',
		position: 'absolute',
		right: 0,
		top:commonTools.actualWidth (4),
      	width: commonTools.actualWidth (35),
      	height: commonTools.actualWidth (35),
      	alignItems: 'center',
      	justifyContent: 'center',
	},
    separator: 
	{
      	position: 'absolute',
      	left: 0,
      	bottom: 0,
      	height: commonTools.pixel,
      	width: commonTools.screenWidth,
      	backgroundColor: commonColor.separatorColor,
    },
});

module.exports 	= React.createClass (
	{
		getInitialState: function ()
		{
			return{
			  };
		},
		shouldComponentUpdate: function (nextProps, nextState) 
		{
			if (this.state.menuData == nextState.menuData) 
			{
				  return false;
			}
			return true;
		},
		
		fetchDataSuccess:function (responseData)
		{
			this.state.menuData = new Array ();
			for (var i in responseData[NodeId])
			{
				var name 		= "";
				var nodeId 		= "";
				var src 		= "";
				var value 		= "";
				try
				{
					name 		= responseData[NodeId][i].name;
					nodeId 		= responseData[NodeId][i].fields.REDREICT_ID;
					value 		= responseData[NodeId][i].fields.VALUE;
					src 		= responseData[NodeId][i].fields.IMAGES.image.src;
				}
				catch (e)
				{
					console.log('fetchDataSuccess e = ' + e);
				}
				
				this.state.menuData[i] 			= {};
				this.state.menuData[i].title 	= name;
				this.state.menuData[i].nodeId 	= nodeId;
				this.state.menuData[i].src 		= src;
				this.state.menuData[i].value 	= value;
			}
			this.state.finishFetchData = true;
			this.forceUpdate ();
			if (_MenuListViewPageItems && _MenuListViewPageItems[0])
			{
				_MenuListViewPageItems[0].clickThisPage ();
			}
		},
		fetchDataFail:function (error)
		{
		},
		componentDidMount: function () 
		{
			if (this.isAndroid ())
			{
				fetch (Config.ContentObjectServlet(NodeId))
				.then((response) => response.json())
				.then((responseData) => 
				{
					this.fetchDataSuccess(responseData);
		        })
				.catch(error => {
		          	this.fetchDataFail(error);
		        })
				.done();
			}
			
		},
		
		getNodeId ()
		{
			return NodeId;
		},
		
		finishGetData:function (data)
		{
			this.state.menuData = new Array ();
			for (var i in data)
			{
				this.state.menuData[i] = {};
				this.state.menuData[i].title 	= data[i].title;
				this.state.menuData[i].nodeId 	= data[i].nodeId;
				this.state.menuData[i].src 		= data[i].src;
				this.state.menuData[i].value 	= data[i].value;
			}
		},
		clickRightButton:function()
		{
			if (this.props.onPressMenuButtonRight)
			{
				var arr = new Array ();
				for (var i = 0 ; i < this.state.menuData.length - 1; i += 2)
				{
					if ( i + 1 < this.state.menuData.length)
					{
						arr.push (new Array (this.state.menuData[i].title, this.state.menuData[i+1].title));
					}
					
				}
				this.props.onPressMenuButtonRight (arr);
			}
		},
		
		onChangeTab:function (page)
		{
			if (_MenuListViewPageItems && _MenuListViewPageItems[page.i])
			{
				_MenuListViewPageItems[page.i].clickThisPage ();
			}
		},
		onPressMenuButtonRight:function ()
		{
			//_ScrollableTabBar.goToPage (5);
			console.log('onPressMenuButtonRight');
		},
		renderItem:function ()
		{
			var child = new Array ();
			for (var i in this.state.menuData)
			{
				try {
				child.push(
					<MenuListViewPageItem
						key 		= {i}
						tabLabel 	= {this.state.menuData[i].title}
			  			style 		= {Style.pages}
						title 		= {this.state.menuData[i].title}
						nodeId 		= {this.state.menuData[i].nodeId}
						src 		= {this.state.menuData[i].src}
						value 		= {this.state.menuData[i].value}
						ref 		= {(ref)=>{_MenuListViewPageItems.push(ref)}}
						navigator   = {this.props.navigator}>
					</MenuListViewPageItem>
				);
				} catch (e){
					console.log('renderItem e = ' + e);
				}
			}
			return (
				<View style 	= {{height:commonTools.screenHeight - commonTools.actualWidth (50)}}>
					<ScrollableTabView 
						initialPage 	= {0} 
						renderTabBar 	= {() => <ScrollableTabBar 
													style	= {Style.ScrollableTabBar}
													activeTextColor = {'#ff8f00'}
													inactiveTextColor = {'#262626'}
													underlineColor = {'#ff8f00'}
													moreIcon = {require ('../img/btn_moreMenu.png')}
													onClickMoreBtn = {this.clickRightButton}/>}
						onChangeTab 	= {this.onChangeTab}
						ref = {(tabbar)=>_ScrollableTabBar = tabbar}>
						{child}
					</ScrollableTabView>
					
				</View>
				
			);
			
		},
		isAndroid:function()
		{
			return Platform.OS == "android";
		},
		render:function ()
		{
			if (this.isAndroid ())
			{
				if (this.state.finishFetchData)
				{
					return (
						<View style 	= {Style.container}>
							{
								this. renderItem ()
							}
						</View>
					);
				}
				else
				{
					return (
						<LoadingView/>
					);
				}
			}
			else 
			{
				return (
					<View 
						sytle 	= {Style.container}>
						<View 
							style 	= {Style.topView}>
						</View>
						<MenuListViewPage 
							NodeId 		= {this.getNodeId()}
							navigator   = {this.props.navigator}
							onClickMoreBtn = {this.clickRightButton}
							finishGetData = {this.finishGetData}>
						</MenuListViewPage>
					</View>
				);
			}
			

		}
	}
);
