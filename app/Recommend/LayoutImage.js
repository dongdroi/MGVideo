/**
*每个cell下面的具体布局内容
*/
var React 					= require ('react-native');
var MyImage 				= require ('../Widgets/MyImage');
var Dimensions 				= require ('Dimensions');
var LayoutImageItem 		= require ('./LayoutImageItem');
var LayoutImageReflush 		= require ('./LayoutImageReflush');
var LayoutImageItemForLive 	= require ('./LayoutImageItemForLive');
var LayoutNoImage 			= require ('./LayoutNoImage');
var LayoutImageItemSport 	= require ('./LayoutImageItemSport');
var LayoutImageForGirl 		= require ('./LayoutImageForGirl');
var Carousel 				= require ('react-native-carousel');

var DEFAULT_LAYOUT 		= 0;//普通布局
var FEATURED_LAYOUT 	= 1;//精选布局
var LIVE_LAYOUT 		= 2;//直播布局
var SUPER_GIRL_LAYOUT 	= 3;//超女直通区布局

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

var Style 	= React.StyleSheet.create (
{
	//通用横向布局
	horizontalView:
	{
		flexDirection: 'row',
	},
	containerNoBottom: 
	{
		backgroundColor:'white',
		paddingBottom:commonTools.myActualWidth (15),
	},
	containerPadding: 
	{
		backgroundColor:'white',
		paddingBottom:commonTools.myActualWidth (20),
	},
	containerMargin: 
	{
		backgroundColor:'white',
		marginBottom:commonTools.myActualWidth (20),
	},
	titleText:
	{
		fontSize:commonTools.myActualWidth (26),
		marginTop: 8,
		marginLeft: 8,
		marginBottom: 4,
		color:'#595968',
	},
	longNameText:
	{
		fontSize:commonTools.myActualWidth (20),
		color:'#969696',
		paddingTop:commonTools.myActualWidth (5),
		marginLeft: 0,
	},
	activeDot:
	{
		backgroundColor: '#007aff', 
		width: 8, 
		height: 8, 
		borderRadius: 4, 
		marginLeft: 3, 
		marginRight: 3, 
		marginTop: 3, 
		marginBottom: commonTools.myActualWidth (40),
	},
	dot:
	{
		backgroundColor:'rgba(0,0,0,.2)', 
		width: 8, 
		height: 8,
		borderRadius: 4, 
		marginLeft: 3, 
		marginRight: 3, 
		marginTop: 3, 
		marginBottom: commonTools.myActualWidth (40),
	},
	
	//直播内的标题栏
	liveCellTitleView:
	{
		flexDirection: 'row',
		width:commonTools.screenWidth,
		padding:commonTools.myActualWidth(10),
		justifyContent: 'center',
		alignItems: 'center',
	},
	//直播内的标题栏最前端的方框
	liveCellTitleStart:
	{
		width:commonTools.myActualWidth(10),
		height:commonTools.myActualHeight(25),
		backgroundColor: '#FE8A02', 
		marginRight:commonTools.myActualHeight(15),
	},
	
	//直播内的标题栏内文字颜色
	liveCellTitleText:
	{
		fontSize:11,
		color:"#FE8A02",
	},
	emptyView:
	{
		flex:1,
	},
	//直播内的热播的框
	liveHotCell:
	{
		borderWidth:1,
		borderColor:"grey",
		margin:5,
	},
	
	

});
//不同布局下面对应的不同图片的分辨率
var size	 = [[750, 350],[],[375,210],[250,375],[],[375,210],[375,210],[375,210]];

module.exports 	= React.createClass(
{
	getInitialState: function ()
	{
		return{
			data: null,
			onClick: PropTypes.func,
			value:PropTypes.number,
			showCount:PropTypes.number,
			title:PropTypes.string,
		  };
	},
	shouldComponentUpdate: function (nextProps, nextState) 
	{
		if (this.props.data == nextProps.data) 
		{
			  return false;
		}
		return true;
	},
	
	onCilckItem:function (data)
	{
		if (this.props.onClick)
		{
			this.props.onClick (data);
		}
	},
	onClickTitle:function(data)
	{
		if (this.props.onCilckTitle)
		{
			this.props.onCilckTitle (data);
		}
	},
	
	//直播选项内的title
	addTitleInLiveCell:function (layoutIndex, children)
	{
		if (layoutIndex == LIVE_LAYOUT)
		{
			var rightTip = false;
			if (this.props.fatherData.name == "热门电视台" || this.props.fatherData.nodeId == "70001846" ||
				this.props.fatherData.name == "精彩回看" || this.props.fatherData.nodeId == "70001845")
			{
				rightTip = true;
			}
			children.push (
				<View
					key 	= {-1}
					style 	= {Style.liveCellTitleView}>
					<View 
						style 	= {Style.liveCellTitleStart}>
					</View>
					<Text 
						style 	= {Style.liveCellTitleText}>
						{this.props.fatherData.name}
					</Text>
					<View 
						style 	= {Style.emptyView}>
					</View>
					{
						rightTip?(
							<TouchableOpacity
								onPress	= {() => this.onPressAllChannel()}>
								<Text
									style 	= {Style.liveCellTitleText}>
									所有电视台
								</Text>
							</TouchableOpacity>
							):
							(null)
					}
				</View>
			);
		}
		return children;
	},
	onPressAllChannel:function ()
	{
		console.log("onPressAllChannel");
	},
	
	//添加value为1的时候的布局
	addOneImage:function (layoutIndex, children)
	{
		var key = children.length + 1;
		var value 	= parseInt(this.props.value);
		var count 	= this.props.showCount;
		if (count > this.props.data.length)
		{
			count 	= this.props.data.length;
		}
		if (layoutIndex == LIVE_LAYOUT)
		{
			children 	= this.addTitleInLiveCell (LIVE_LAYOUT, children);
			var child 	= new Array ();
			for (var i = 0; i < count; i ++)
			{
				child.push (
					<LayoutImageItemForLive
						key 		= {i}
						data 		= {this.props.data[i]}
						onClick 	= {this.onCilckItem}>
					</LayoutImageItemForLive>
				);
			}
			
			children.push (
				<View 
					key 	= {key}
					style = {Style.liveHotCell}>
					{child}
				</View>
			);
		}
		else if (layoutIndex == FEATURED_LAYOUT)
		{
			children.push (
				<LayoutNoImage
					key 			= {key}
					data 			= {this.props.data}
					onClick 		= {this.onCilckItem}
					fatherData 		= {this.props.fatherData}
					count 			= {this.props.showCount}
					onClickTitle 	= {this.onClickTitle}>
				</LayoutNoImage>
			);
		}
		else if (layoutIndex == SUPER_GIRL_LAYOUT)
		{
			for (var i = 0; i < count; i ++)
			{
				children.push (
					<Image
						key 	= {key + i}
						style 	= {{
							width: commonTools.myActualWidth(size[0][0]),
							height: commonTools.myActualHeight(size[0][1]),
							backgroundColor: 'transparent'}}
						source 	= {{uri: this.props.data[i].fields.IMAGES.image.src}}></Image>
				);
			}
		}
		else 
		{
			
			// LayoutImageItemSport
			var child 	= new Array ();
			for (var i = 0; i < count; i ++)
			{
				children.push (
					<LayoutImageItemSport
						key 		= {key + i}
						data 		= {this.props.data[i]}
						onClick 	= {this.onCilckItem}>
					</LayoutImageItemSport>
				);
			}
			
		}
		return children;
	},
	//添加大图
	addSingleBigImage:function (children, data)
	{
		children.push(
			<View key={0}>
				<Text style 	= {Style.titleText}>
					{this.props.title}
				</Text>
					
				<LayoutImageItem
					width 		= {size[0][0]}
					height 		= {size[0][1]}
					data 		= {data[0]}
					onClick 	= {this.onCilckItem}>
				</LayoutImageItem>
					
				<Text style 	= {Style.longNameText}>
					{data[0].fields.LONG_NAME}
				</Text>
			</View>
		);
		return children;
	},
	//添加轮播大图
	addSwiperImage:function (children, data)
	{
		var value 			= parseInt(this.props.value);
		var count 			= this.props.showCount;
		if (count > data.length)
		{
			count 	= data.length;
		}
		
		var child 	= new Array();
		for (var i = 0; i < count; i ++)
		{
			child.push(
				<LayoutImageItem
					width		= {size[0][0]}
					height 		= {size[0][1]}
					data 		= {data[i]}
					onClick 	= {this.onCilckItem}
					key 		= {i}
					longname 	= {true}>
				</LayoutImageItem>
			);
		}
		children.push (
			<View 
				key 	= {0} 
				style 	= {[Style.horizontalView, {height: 208, marginTop: 4}]}>
				<Carousel 
					width 					= {commonTools.screenWidth}
					delay 					= {5000} 
					hideIndicators 			= {false} 
					indicatorColor 			= {"#ff8f00"}
					indicatorSize 			= {commonTools.myActualHeight(54)} 
					indicatorSpace 			= {commonTools.myActualHeight(24)}
					inactiveIndicatorColor 	= {"#fcfcfc"} 
					indicatorAtBottom 		= {true}
					indicatorOffset 		= {commonTools.myActualHeight(80)} 
					loop 					= {true}>
					
					{child}
				</Carousel>
			</View>
		);
		return children;
	},
	
	//添加value为2或者3的时候的布局
	addTwoOrThreeImage:function(children, data, layoutIndex)
	{
		var isChannel = false;
		if (layoutIndex == LIVE_LAYOUT && (this.props.fatherData.name == "热门电视台" || this.props.fatherData.nodeId == "70001846"))
		{
			isChannel = true;
		}
		
		var value 	= parseInt(this.props.value);
		var count 	= this.props.showCount;
		if (count > data.length)
		{
			count 	= data.length;
		}
		for (var i = 0; i < count; i += value)
		{
			var child 	= new Array();
			for (j = i; j < data.length; j ++)
			{
				if (j-i < value)
				{
					child.push(
						<LayoutImageItem
							key 		= {j}
							width 		= {size[value][0]}
							height 		= {isChannel?(170):(size[value][1])}
							data 		= {data[j]}
							onClick 	= {this.onCilckItem}
							longname 	= {this.props.value==2?(true):(false)}
							showInfo 	= {isChannel?(false):(true)}>
						</LayoutImageItem>
					);
				}
			}
			children.push(
				<View 
					key 	= {i} 
					style 	= {[Style.horizontalView, {marginBottom:5}]}>
					{child}
				</View>
			);
		}
		return children;
	},
	//添加带按钮的布局
	addButtonLayout:function (key, data, needTitle, children)
	{
		if (this.props.fatherData.nodeId == "70006328" || this.props.fatherData.name == "热点资讯")
		{
			needTitle = false;
		}
		var value 	= parseInt (this.props.value);
		children.push(
			<LayoutImageReflush
				key 			= {key}
				data 			= {data}
				count 			= {this.props.showCount}
				width			= {size[value][0]}
				height 			= {size[value][1]}
				value 			= {value}
				fatherData 		= {this.props.fatherData}
				needTitle 		= {needTitle}
				onClickTitle 	= {this.onClickTitle}
				onClick 		= {this.onCilckItem}>
			</LayoutImageReflush>
		);
		return children;
	},
	
	//添加超女的特殊布局
	addGirlLayout:function (value, children, data)
	{
		
		var key 	= children.length + 1;
		children.push (
			<LayoutImageForGirl
				key 		= {key}
				fatherData 	= {this.props.fatherData}
				showCount 	= {this.props.showCount}
				value 		= {value}
				data 		= {data}
				width 		= {size[value][0]}
				height 		= {size[value][1]}
				showHot 	= {value == 7?(true):(false)}
				onClickTitle 	= {this.onClickTitle}
				onClick 		= {this.onCilckItem}>
			</LayoutImageForGirl>
		);
		return children;
	},
	//由于有些选项下面有特殊的排版要求，所以添加一个标签来区分
	chooseLayout:function ()
	{
		if (this.props.fatherData.fatherTitle == "精选" || this.props.fatherData.fatherNodeId == "70006327")
		{
			return FEATURED_LAYOUT;
		}
		else if (this.props.fatherData.fatherTitle == "直播" || this.props.fatherData.fatherNodeId == "70001838")
		{
			return LIVE_LAYOUT;
		}
		else if (this.props.fatherData.fatherTitle == "超女直通区" || this.props.fatherData.fatherNodeId == "70011432")
		{
			return SUPER_GIRL_LAYOUT;
		}
		return DEFAULT_LAYOUT;
	},
	
	renderItem:function ()
	{
		if(!this.props.data)
		{
			return;
		}
		
		var layoutIndex 		= this.chooseLayout ();
		var needNotAddBottom 	= false;
		var children 			= new Array();
		var data 				= this.props.data;
		if (this.props.value == 0)//默认推荐的大图
		{
			if (this.props.showCount == 1 || this.props.showCount == 100)
			{
				needNotAddBottom 	= true;
				children = this.addSingleBigImage (children, data);
			}
			else//轮播大图
			{
				needNotAddBottom 	= true;
				children = this.addSwiperImage (children, data);
			}
			
		}
		else if (this.props.value == 1)
		{
			if (this.props.fatherData.nodeId == "70006329" || this.props.fatherData.name == "今日资讯")
			{
				needNotAddBottom 	= true;
			}
			children 	= this.addOneImage (layoutIndex, children);
			
		}
		else if (this.props.value == 2 || this.props.value == 3)
		{
			if (layoutIndex == DEFAULT_LAYOUT || layoutIndex == LIVE_LAYOUT)
			{
				children = this.addTitleInLiveCell (layoutIndex, children);
				children = this.addTwoOrThreeImage (children, data, layoutIndex);
			}
			else if (layoutIndex == FEATURED_LAYOUT)
			{//精选菜单下面的特殊布局
				children 	= this.addButtonLayout(0, data, true, children);
			}
			else if (layoutIndex == SUPER_GIRL_LAYOUT)
			{//超女下面的特殊布局2&3
				
			}
			
		}
		else if (this.props.value == 4)
		{
			if (layoutIndex == SUPER_GIRL_LAYOUT)
			{
				
			}
		}
		else if (this.props.value == 5)
		{
			children 	= this.addButtonLayout(0, data, false, children);
		}
		else if (this.props.value == 6)
		{
			if (layoutIndex == SUPER_GIRL_LAYOUT)
			{
				children 	= this.addGirlLayout (this.props.value, children, data);
			}
		}
		else if (this.props.value == 7)
		{
			if (layoutIndex == SUPER_GIRL_LAYOUT)
			{
				children 	= this.addGirlLayout (this.props.value, children, data);
			}
		}
		else 
		{
			// console.log("this.props.value="+this.props.value);
		}
		
		return(
			<View style 	= {needNotAddBottom ? (Style.containerNoBottom):(layoutIndex == FEATURED_LAYOUT?(Style.containerMargin):(Style.containerPadding)) }>
				{children}
			</View>
		);
	},
	render: function(){
		
		return (
			<View>
				{this.renderItem ()}
			</View>
		);
	},

});
