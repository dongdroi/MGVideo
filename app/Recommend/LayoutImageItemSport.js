/**
*独立的每张图片的布局，包括显示vip，免费和信息
*/
'use strict';
var React 		= require('react-native');
var Config 		= require('../Config/Config');

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

var width 	= commonTools.myActualWidth (450);
var height 	= commonTools.myActualHeight (300);
var Style 	= React.StyleSheet.create (
{
	container: 
	{
		flex:1,
		backgroundColor:'white',
		marginBottom:commonTools.myActualWidth (0),
		flexDirection: 'row',
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
	
	emptyView:
	{
		flex:1,
		marginLeft: 8,
	},
	infoStyle:
	{
		fontSize:commonTools.myActualWidth (20),
		margin: 0, 
		paddingTop:0,
		paddingBottom:0,
		paddingLeft:3,
		paddingRight:3,
		backgroundColor: 'black',
		opacity:0.8,
		color: 'white'
	},
	
	image:
	{
		width:commonTools.myActualWidth (width),
		height:commonTools.myActualHeight (height),
		//marginRight:commonTools.myActualWidth (20),
		marginLeft: 8
	},
	title:
	{
		//width:commonTools.screenWidth - (commonTools.myActualWidth (width + 20 + 20)),
		//height:commonTools.myActualWidth (30),
		fontSize:commonTools.myActualWidth (25),
		color:"black",
	},
	detail:
	{
		flex:1,
		fontSize:commonTools.myActualWidth (22),
		//width:commonTools.screenWidth - (commonTools.myActualWidth (width + 20 + 20)),
		//height:commonTools.myActualWidth (height - 30 - 25-10),
		marginTop:commonTools.myActualWidth (5),
		marginBottom:commonTools.myActualWidth (5),
		color:"grey",
	},
	playTime:
	{
		fontSize:commonTools.myActualWidth (22),
		color:"grey",
		//width:commonTools.screenWidth - (commonTools.myActualWidth (width + 20 + 20)),
		//height:commonTools.myActualWidth (25),
	},
	
	baseLine:
	{
		marginTop:commonTools.myActualWidth (13),
		marginBottom:commonTools.myActualWidth (13),
		marginLeft: 8,
		width:commonTools.screenWidth,
		height: 0.5,
		backgroundColor:"#e0e0e0",
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
	fetchDataSuccess:function (responseData)
	{
		// console.log("responseData="+responseData.fields.Detail);
		this.props.data.myDetail = responseData.fields.Detail;
		this.forceUpdate ();
	},
	fetchDataFail:function (error)
	{
	},
	
    componentDidMount: function () 
	{
		var url 	= Config.ProgrameServlet(this.props.data.fields.PROGRAM_ID);
		commonTools.get(url, this.fetchDataSuccess, this.fetchDataFail);
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
		if (this.props.data)
		{
			
			var src 	= commonTools.getImageUrlForLayoutImageItem (this.props.data, width, height);
			var playTime 	= "播放" + 32;
			var videoTime 	= "03:45";
			
			return (
				<View>
					<TouchableOpacity 
						key 	= {this.props.key} 
						style	= {Style.container} 
						onPress	= {() => this.onPressItem ()}>
						
						<Image
							source 	= {{uri: src}}
							style 	= {Style.image}>
							<View style 	= {Style.emptyView}></View>
							<View style 	= {{flexDirection: 'row',width:commonTools.myActualWidth (width)}}>
								<View style 	= {Style.emptyView}></View>
								<Text 
									style 	= {Style.infoStyle}>
									{videoTime}
								</Text>
							</View>
						</Image>
									
			 			<View style 	= {Style.emptyView}>
							<Text style 	= {Style.title}>{this.props.data.name}</Text>
							<Text style 	= {Style.detail} numberOfLines={2}>{this.props.data.myDetail}</Text>
							<Text style 	= {Style.playTime}>{playTime}</Text>
						</View>
									
					</TouchableOpacity>
									
					<View style 	= {Style.baseLine}></View>
				</View>
				
			);
		}
		else 
		{
			return (<View/>);
		}
		
	},

});
