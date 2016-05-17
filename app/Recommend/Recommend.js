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
		marginTop: commonTools.myActualHeight (40),    
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
				var name 		= responseData[NodeId][i].name;
				var nodeId 		= responseData[NodeId][i].fields.REDREICT_ID;
				var src 		= responseData[NodeId][i].fields.IMAGES.image.src;
				var value 		= responseData[NodeId][i].fields.VALUE;
				
				this.state.menuData[i] 			= {};
				this.state.menuData[i].title 		= name;
				this.state.menuData[i].nodeId 		= nodeId;
				this.state.menuData[i].src 		= src;
				this.state.menuData[i].value 		= value;
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
		
		onChangeTab:function (page)
		{
			if (_MenuListViewPageItems && _MenuListViewPageItems[page.i])
			{
				_MenuListViewPageItems[page.i].clickThisPage ();
			}
		},
		onPressMenuButtonRight:function ()
		{
			_ScrollableTabBar.goToPage (5);
		},
		renderItem:function ()
		{
			var child = new Array ();
			for (var i in this.state.menuData)
			{
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
			
			}
			return (
				<View style 	= {{height:commonTools.screenHeight - commonTools.actualWidth (50)}}>
					<ScrollableTabView 
						initialPage 	= {0} 
						renderTabBar 	= {() => <ScrollableTabBar 
													style	= {Style.ScrollableTabBar}
													activeTextColor = {'#FE8A02'}
													inactiveTextColor = {'#262626'}
													underlineColor = {'#FE8A02'}/>}
						onChangeTab 	= {this.onChangeTab}
						ref = {(tabbar)=>_ScrollableTabBar = tabbar}>
						{child}
					</ScrollableTabView>
					<View style 	= {Style.menuButtonView}>
					<TouchableOpacity 
						style 	= {Style.menuButton} 
						onPress = {this.onPressMenuButtonRight}>
						<Image 
							source 	= {require ('../img/btn_moreMenu.png')}>
						</Image>
					</TouchableOpacity>
					</View>
					
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
						<Text style 	= {Style.container}>
						Loading
						</Text>
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
							NodeId 	= {this.getNodeId()}>
						</MenuListViewPage>
					</View>
				);
			}
			

		}
	}
);
