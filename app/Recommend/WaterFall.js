'use strict';
var React 			= require('react-native');
var WaterFallItem 	= require ('./WaterFallItem');

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
    },
	mainView:
	{
		flexDirection: 'row',
		width:commonTools.screenWidth,
	},
	leftChildView:
	{
		flex:1,
		marginLeft:8,
		marginRight:2,
	},
	rightChildView:
	{
		flex:1,
		marginRight:8,
	},
});

module.exports = React.createClass (
{
	
	shouldComponentUpdate: function (nextProps, nextState) 
	{
		if (this.props.data == nextProps.data) 
		{
			  return false;
		}
		return true;
	},
	onClick:function (data)
	{
		console.log (commonTools.StringRTrim(data.name)+"="+data.fields.PROGRAM_ID);
	},
	
	processData:function ()
	{
		var width 		= (commonTools.screenWidth - 18)/2;
		var leftArray 	= new Array ();
		var rightArray 	= new Array ();
		for (var i in this.props.data)
		{
			if (i%2 == 0)
			{
				rightArray.push (
					<WaterFallItem
						data 	= {this.props.data[i]}
						key 	= {i}
						width 	= {width}
						height 	= {width * (i < 2?(0.3142857):(1.22857))}
						showInfo 	= {i < 2?(false):{true}}
						onClick 	= {this.onClick}>
					</WaterFallItem>
				);
			}
			else 
			{
				leftArray.push (
					<WaterFallItem
						data 	= {this.props.data[i]}
						key 	= {i}
						width 	= {width}
						height 	= {width * (i < 2?(0.3142857*2):(1.22857))}
						showInfo 	= {true}
						onClick 	= {this.onClick}>
					</WaterFallItem>
				);
			}
		}
		return new Array(leftArray,rightArray);
	},
	
	render:function ()
	{
		var childArray = this.processData ();
		return (
			<ScrollView>
				<View style 	= {Style.mainView}>
					<View 
						style 	= {Style.leftChildView}>
						{childArray[0]}
					</View>
					<View 
						style 	= {Style.rightChildView}>
						{childArray[1]}
					</View>
				</View>
			</ScrollView>
		);
	}
});
