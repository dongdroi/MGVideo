'use strict';
var React 				= require ('react-native');
var Config 				= require ('../Config/Config');
var MyImage 			= require ('../Widgets/MyImage');
var Dimensions 			= require ('Dimensions');
var RecommendListCell 	= require ('./RecommendListCell');
var WaterFall  			= require ('./WaterFall');

var {
	Text,
	TouchableOpacity,
	View,
	ListView,
	Image,
	PropTypes,
	ScrollView,
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
      	flex: 1,
    },
	contentContainer: 
	{
		 flex:1,
		 height:commonTools.myActualPageHeight (),
	 },
 	listView: 
	{
 		marginTop: 0,
 		marginBottom: 0,
		flex:1,
 	},
});

module.exports = React.createClass (
	{
		getInitialState: function ()
		{
			return{
				dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
				isNeedGetData:false,
				nodeNet:new Array (),
				contentDatas:new Array (),
			  };
		},
		
		//用于和顶部的menubar进行数据同步处理
		clickThisPage:function ()
		{
			
			if (!this.state.isNeedGetData)
			{
				this.fetchAllData ();
			}
			
		},
		
		fetchAllDataSuccess:function (responseData)
		{
			var useWaterFall = false;
			if (this.props.title == "印象天下" || this.props.nodeId == "70001850")
			{
				this.setState ({
					responseData:responseData[this.props.nodeId],
				});
			}
			else
			{
				var dataArray 	= new Array ();
				for (var i in responseData[this.props.nodeId])
				{
					var myNodeNet 			= {}; 
					myNodeNet.fatherTitle 	= this.props.title;
					myNodeNet.fatherNodeId 	= this.props.nodeId;
					myNodeNet.name 			= responseData[this.props.nodeId][i].name;
					myNodeNet.nodeId 		= responseData[this.props.nodeId][i].fields.REDREICT_ID;
					myNodeNet.ranking 		= responseData[this.props.nodeId][i].ranking;
					if (!responseData[this.props.nodeId][i].fields.VALUE || responseData[this.props.nodeId][i].fields.VALUE.length <= 0)
					{
						myNodeNet.value 	= this.props.value;
					}
					else 
					{
						myNodeNet.value 	= responseData[this.props.nodeId][i].fields.VALUE;
					}
				
					try{
						myNodeNet.showCount 	= responseData[this.props.nodeId][i].fields.REDREICT_NODE_INFO.showCount;
						myNodeNet.lookType 		= responseData[this.props.nodeId][i].fields.REDREICT_NODE_INFO.lookType;
					}
					catch(e)
					{
						console.log("error in get showCount && lookType");
					}
				
					try
					{
						myNodeNet.PROGRAM_ID 	= responseData[this.props.nodeId][i].fields.PROGRAM_ID;
						myNodeNet.commonStyle 	= responseData[this.props.nodeId][i].fields.REDREICT_NODE_INFO.commonStyle;
						myNodeNet.src 			= responseData[this.props.nodeId][i].fields.IMAGES.image.src;
					
					}
					catch(e)
					{
						myNodeNet.commonStyle 	= "";
						myNodeNet.src 			= ""
					}
				
					myNodeNet.isAppend 	= false;
					dataArray.push (myNodeNet)
				}
			
				this.state.isNeedGetData 	= true;
				this.setState ({
					nodeNet:dataArray,
				});
				this.appendData (1);
			}
			
		},
		fetchAllDataFail:function (error)
		{
			this.state.isNeedGetData  = false;
			console.log("error="+error);
		},
		
		fetchAllData:function ()
		{
			if (!this.state.isNeedGetData && this.state.nodeNet.length <= 0)
			{
				fetch (Config.ContentObjectServlet (this.props.nodeId))
				.then ((response) => response.json ())
				.then ((responseData) => 
				{
					this.fetchAllDataSuccess (responseData);
		        })
				.catch (error => 
				{
					this.fetchAllDataFail (error);
				})
				.done ();
			}
		},
		
		appendData:function (limit)
		{
			var dataArray 	= new Array ();
			var index		= 0;
			for (var i in this.state.nodeNet)
			{
				if (this.state.nodeNet[i].isAppend)
				{
					var myNodeNet 			= {}; 
					myNodeNet.fatherTitle 	= this.state.nodeNet[i].fatherTitle;
					myNodeNet.fatherNodeId 	= this.state.nodeNet[i].fatherNodeId;
					
					myNodeNet.name 			= this.state.nodeNet[i].name;
					myNodeNet.nodeId 		= this.state.nodeNet[i].nodeId;
					myNodeNet.value		 	= this.state.nodeNet[i].value;
					myNodeNet.ranking 		= this.state.nodeNet[i].ranking;
					myNodeNet.showCount 	= this.state.nodeNet[i].showCount;
					myNodeNet.lookType 		= this.state.nodeNet[i].lookType;
					myNodeNet.commonStyle 	= this.state.nodeNet[i].commonStyle;
					myNodeNet.src 			= this.state.nodeNet[i].src;
					myNodeNet.PROGRAM_ID 	= this.state.nodeNet[i].PROGRAM_ID;
					
					dataArray.push (myNodeNet)
				}
				else if (!this.state.nodeNet[i].isAppend && index < limit)
				{
					var myNodeNet 			={}; 
					myNodeNet.fatherTitle 	= this.state.nodeNet[i].fatherTitle;
					myNodeNet.fatherNodeId 	= this.state.nodeNet[i].fatherNodeId;
					
					myNodeNet.name 			= this.state.nodeNet[i].name;
					myNodeNet.nodeId 		= this.state.nodeNet[i].nodeId;
					myNodeNet.value 		= this.state.nodeNet[i].value;
					myNodeNet.ranking 		= this.state.nodeNet[i].ranking;
					myNodeNet.showCount 	= this.state.nodeNet[i].showCount;
					myNodeNet.lookType 		= this.state.nodeNet[i].lookType;
					myNodeNet.commonStyle 	= this.state.nodeNet[i].commonStyle;
					myNodeNet.src 			= this.state.nodeNet[i].src;
					myNodeNet.PROGRAM_ID 	= this.state.nodeNet[i].PROGRAM_ID;
					
					dataArray.push (myNodeNet)
					this.state.nodeNet[i].isAppend 	= true;
					index ++;
				}
			}
			if (index > 0)
			{
				this.setState ({
					dataSource:this.state.dataSource.cloneWithRows(dataArray),
				});
			}

		},
		
		onEndReached: function ()
		{
			this.appendData (1);
		},
		
	    renderCell: function (nodeNetItem) 
		{
	      return (
			  <RecommendListCell
				data 	= {nodeNetItem}
				navigator = {this.props.navigator}/>
	      );
	    },
		
		render:function ()
		{
			var useWaterFall = false;
			if (this.props.title == "印象天下" || this.props.nodeId == "70001850")
			{
				useWaterFall = true;
			}
			
			return (
				<View 
					style 	={Style.container}>
					{
						useWaterFall?
						(
							<WaterFall
								data 	= {this.state.responseData}>
							</WaterFall>
						):
						(
							<ListView
								dataSource 		= {this.state.dataSource}
		        				renderRow 		= {this.renderCell}
		        				style 			= {Style.listView}
								onEndReached 	= {this.onEndReached}>
							</ListView>
						)
					}
					
				</View>
			);
		}
	}
);
