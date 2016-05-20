'use strict';
var React 	= require('react-native');
import AddPaging from './PagedScrollView'

var InvertibleScrollView 		= require('react-native-invertible-scroll-view');
var InvertiblePagedScrollView 	= AddPaging(InvertibleScrollView);

var MenuListView 	= require('./MenuListView');
var _MenuListView;

var MenuListViewPageItem 	= require('./MenuListViewPageItem');
var _MenuListViewPageItems 	= new Array();

var Config 	= require('../Config/Config');

var {
	Text,
	TouchableOpacity,
	View,
	ListView,
	Image,
	PropTypes,
	ActivityIndicatorIOS
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
		backgroundColor: '#eeeeee',
		flex:1,
	},
	listView: 
	{
		marginTop: commonTools.myActualHeight (65),
		marginBottom: 0
	},
    menuView: 
	{
      	width: commonTools.screenWidth,
      	height: commonTools.actualWidth (25),
    },
    menuButton: 
	{
      	position: 'absolute',
      	right: 0,
      	top: commonTools.actualWidth (-5),
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
	pages:
	{
		flex:1,
      	width: commonTools.screenWidth,
      	height: commonTools.myActualPageHeight (),
	},
	pageView:
	{
		width: commonTools.screenWidth, 
		height: commonTools.myActualPageHeight (),
	}
});

var menuData 	= new Array();//标题数据源
module.exports 	= React.createClass (
	{
		getInitialState: function()
		{
			return{
			  };
		},
		
		//顶部的menuitem相关
		renderMenuItem:function ()
		{
			return(
				<View 
					style 	= {Style.menuView}>
					<MenuListView 
						ref			= {(menulistview) => { _MenuListView = menulistview; }}
						url 		= {Config.ContentObjectServlet(this.props.NodeId)} 
						nodeid 		= {this.props.NodeId}
						onClick 	= {this.menuItemOnclick}
						setData 	= {this.menuItemFinishGetData}>
					</MenuListView>
						
					<TouchableOpacity 
						style 	= {Style.menuButton} 
						onPress = {this.onPressMenuButtonRight}>
						<Image 
							source 	= {require ('../img/btn_moreMenu.png')}>
						</Image>
					</TouchableOpacity>
						
					<View 
						style = {Style.separator}>
					</View>
				</View>
			);
		},
		menuItemOnclick:function (data,rowID)
		{
			rowID 	= parseInt(rowID)
			if (this._scrollView)this._scrollView.scrollWithoutAnimationToPage (rowID+1, 0);
		},
		menuItemFinishGetData:function(data)
		{
			for (var i in data)
			{
				menuData[i] = {};
				menuData[i].title 		= data[i].title;
				menuData[i].nodeId 		= data[i].nodeId;
				menuData[i].src 		= data[i].src;
				menuData[i].value 		= data[i].value;
				// menuData[i].showCount 	= data[i].showCount;
				// menuData[i].lookType 	= data[i].lookType;
			}
			this.setState ({
			});
			this.gotoPage (0);
		},
		
		//顶部的menuitem最右边的更多按钮
		onPressMenuButtonRight: function ()
		{
			this.gotoPage(5);
		},
		
		//下部的page页面
		renderPage ()
		{
			if (menuData.length == 0)
			{
				return;
			}
			return (
				<InvertiblePagedScrollView
					ref 			= {(c) => {this._scrollView = c}}
				    horizontal 		= {true}
					inverted 		= {false}
					pagingEnabled 	= {true}
					onPageChange 	= {this.handlePageChange}>
					{new Array (menuData.length).fill (0).map (this.renderSlide)}
				</InvertiblePagedScrollView>
			);
		},
	    renderSlide: function (x, i) 
		{
	      return (
			  <View 
			  	key 	= {`slide-${i}`} 
				style 	= {Style.pageView}>
				<MenuListViewPageItem
			  		style 	= {Style.pages}
					title 	= {menuData[i].title}
					nodeId 	= {menuData[i].nodeId}
					src 	= {menuData[i].src}
					value 	= {menuData[i].value} 
					navigator 	= {this.props.navigator}
					// showCount={menuData[i].showCount}
					// lookType={menuData[i].lookType}
					ref 	= {(menuListViewPageItem) => {_MenuListViewPageItems.push(menuListViewPageItem); }}>
				</MenuListViewPageItem>
			  </View>
			
	      )
	    },
	    handlePageChange: function (state) 
		{
			var rowID 	= state.currentHorizontalPage -1;
			_MenuListView.setRowId(rowID);
			if (_MenuListViewPageItems&& _MenuListViewPageItems[rowID])_MenuListViewPageItems[rowID].clickThisPage();
	    },
		
		//上下两部分同时跳转
		gotoPage:function (rowID)
		{
			if (this._scrollView)this._scrollView.scrollToPage(rowID);
		},
		
		render:function ()
		{
			return (
       			<View 
					style 	={Style.container}>
					{this.renderMenuItem ()}
					{this.renderPage ()}
        		</View>
			);
		}
	}
);