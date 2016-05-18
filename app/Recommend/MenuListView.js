'use strict'
var React 		= require ('react-native');
var Dimensions 	= require ('Dimensions');

var win_width 		= Dimensions.get ('window').width;
var offsetX 		= 0;//偏移量
var _listView;//listview对象
var actualWidth 	= 13;
var menuData 		= new Array();//标题数据源

var 
{
  Component,
  StyleSheet,
  View,
  Text,
  ListView,
  PropTypes,
  TouchableOpacity,
} = React;

import header, {
  commonStyles,
  commonColor,
  commonTools,
} from '../header'


var menuDataSource 	= new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1 !== r2}
    );

const styles = StyleSheet.create (
{
	menuList:
	{
		width: commonTools.screenWidth-commonTools.actualWidth(35),
	  	height: commonTools.actualWidth(25),
	  	flexDirection: 'row',
  	},
  	menucell: 
	{
    	height: commonTools.actualWidth(25),
    	justifyContent: 'center',
    	alignItems: 'stretch',
    	overflow: 'hidden',
  	},
  	menuTitle: 
  	{
    	fontSize: commonTools.actualWidth(12),
    	textAlign: 'center',
    	marginLeft: commonTools.actualWidth(10),
    	marginRight: commonTools.actualWidth(10),
    	height: commonTools.actualWidth(15),
  	},
  	menuSelectedFlag: 
	{
    	// position: 'absolute',
   	 	height: commonTools.myActualHeight(6),
    	width: commonTools.myActualWidth(48),
    	// left: 0,
    	// bottom: 0,
  	},
  	menuSelectedFlagView:
  	{
    	position: 'absolute',
    	height: commonTools.myActualHeight(6),
    	left: 0,
    	bottom: 0,
	  	flexDirection: 'row',
  	},
});

class MenuListView extends Component 
{
    static propTypes = {
        url: PropTypes.string, 
		nodeid: PropTypes.string, 
        onClick: PropTypes.func,
		setData:PropTypes.func,
    };
	
  	constructor(props) 
	{
    	super(props);
		
    	this.state = {
      	  	selectedIndex: 0,
			finishFetchData:false,
			
    	}
		this.fetchData();
  	}
	
	fetchDataSuccess(responseData)
	{
		for (var i in responseData[this.props.nodeid])
		{
			
			// var status = responseData[this.props.nodeid][i].status;
			// if (status == 1)//需要添加的选项
			// {
			//
			// }
			
			var name 		= responseData[this.props.nodeid][i].name;
			var nodeId 		= responseData[this.props.nodeid][i].fields.REDREICT_ID;
			var src 		= responseData[this.props.nodeid][i].fields.IMAGES.image.src;
			var value 		= responseData[this.props.nodeid][i].fields.VALUE;
			
			// var showCount 	= responseData[this.props.nodeid][i].fields.REDREICT_NODE_INFO.showCount;
// 			var lookType 	= responseData[this.props.nodeid][i].fields.REDREICT_NODE_INFO.lookType;
// 			//0，列表式导航；1，标签式导航；2，评书式导航；3，排行榜导航；4，矩阵式内容集；5，列表式内容集；6，音频式内容集；7，图片式内容集
			
			menuData[i] 			= {};
			menuData[i].title 		= name;
			menuData[i].nodeId 		= nodeId;
			menuData[i].src 		= src;
			menuData[i].value 		= value;
			// menuData[i].showCount 	= showCount;
			// menuData[i].lookType 	= lookType;
			menuData[i].offset 		= commonTools.actualWidth(actualWidth)*name.length+commonTools.actualWidth(10)+commonTools.actualWidth(10);
		}
		
		let index 	= 0;
		
		
		if (this.props.onClick)
		{
			this.props.onClick(menuData[index],index)
		}
		if (this.props.setData)
		{
			this.props.setData(menuData);
		}
		
		this.setState ({
			selectedIndex: index,
			finishFetchData:true,
		});
	}
	fetchDataFail (error)
	{
		console.log("error="+error);
	}
	
	fetchData()
	{
		fetch (this.props.url)
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
	
	setOffSet(rowID)
  	{
		//fix by tyq
		let my_width  		= win_width - commonTools.actualWidth(35);
		let start_offset 	= 0;
		let end_offset 		= 0;

		for (var i = 0; i < rowID; i++) 
		{
			//当前item开始偏移值
			start_offset += menuData[i].offset;
		}
    	//当前item结束偏移值
		end_offset 	= start_offset+menuData[rowID].offset;
		
		if (start_offset-offsetX < 0)
		{
			_listView.scrollTo ({x: start_offset});
		}
		else if (end_offset - offsetX > my_width)
		{
			_listView.scrollTo ({x: end_offset-my_width});
		}
		
		
		//
		// if((offsetX > start_offset) && (offsetX < end_offset))
		// {
		// 	//item处于屏幕左侧外则向右偏移至显示完整
		// 	_listView.scrollTo({x: start_offset});
		// }
		// else if ((offsetX + win_width - commonTools.actualWidth(35) > start_offset) && (offsetX+win_width-commonTools.actualWidth(35) < end_offset))
		// {
		// 	//item处于屏幕右侧外则向左偏移至显示完整
		// 	_listView.scrollTo({x: end_offset-win_width+commonTools.actualWidth(35)});
		// }
		// else
		// {
		// 	//item处于屏幕中间区域不触发偏移事件
		// }

	}

  	onPressMenuTitle (rowID) 
	{
    	this.setOffSet (rowID);
    	this.setState ({selectedIndex: rowID});
		
		if (this.props.onClick)
		{
			this.props.onClick (menuData[rowID],rowID)
		}
  	}
	
	setRowId (rowID)
	{
		if (this.state.finishFetchData)
		{
			this.setOffSet (rowID);
			this.setState ({selectedIndex: rowID});
		}
	}
	getSelectedIndex ()
	{
		return this.state.selectedIndex;
	}

  	onScroll (e) 
	{
		offsetX = e.nativeEvent.contentOffset.x;
  	}

  	renderRow (rowData, sectionID, rowID) 
	{
    	let isSelected 	= (rowID == this.state.selectedIndex)? true : false;
    	let color 		= isSelected ? '#FE8A02' : '#262626';

    	//console.log(13*rowData.title.length);
		var width = commonTools.actualWidth(actualWidth)*rowData.title.length+commonTools.actualWidth(10)+commonTools.actualWidth(10);
    	return (
      		<TouchableOpacity 
				style 			= {styles.menucell}
        		onPress 		= {() => this.onPressMenuTitle(rowID)}
        		activeOpacity 	= {1.0}>
				<Text 
					style 	= {[styles.menuTitle, {color: color}, {width: commonTools.actualWidth(actualWidth)*rowData.title.length}]}>
          	  		{rowData.title}
        		</Text>
        		{
					// isSelected ?<View style={[styles.menuSelectedFlag, {backgroundColor: color}]}/>:null
					
					isSelected ?(<View style 	= {[styles.menuSelectedFlagView,{width:width}]}>
								 	<View style = {{flex:1}}></View>
									<View style = {[styles.menuSelectedFlag, {backgroundColor: color}]}/>
								 	<View style = {{flex:1}}></View>
								 </View>):
								(null)
        		}
      		</TouchableOpacity>
    	);
 	}

  	render() 
	{
    	return (
			<ListView 
				style 							= {styles.menuList}
        		ref 							= {(listView) => { _listView = listView; }}
        		dataSource 						= {menuDataSource.cloneWithRows(menuData)}
        		renderRow 						= {this.renderRow.bind(this)}
        		onScroll						= {this.onScroll.bind(this)}
        		horizontal						= {true}
        		showsHorizontalScrollIndicator 	= {false}
        		pageSize						= {5}
				enableEmptySections				= {true}>
			</ListView>
    	)
  	}
}

module.exports = MenuListView;
