'use strict';
var React = require('react-native');

var {
	Text,
	TouchableOpacity,
	View,
	ListView,
	Image,
	PropTypes,
	ActivityIndicatorIOS
} = React;



var Style = React.StyleSheet.create({
    container: {
      	flex: 1,
      	justifyContent: 'center',
      	alignItems: 'center',
    },
	vipStyle:{
		fontSize:12,
		margin: 0, 
		paddingLeft:3,
		paddingRight:3,
		backgroundColor: '#FE8A02',
      	justifyContent: 'center',
      	alignItems: 'center',
		textAlign:'center',
		textAlignVertical:'center',
		color: 'white',
		height:14,
	},
	freeStyle:{
		marginLeft: 0,
		marginTop: 0,
		resizeMode: 'contain',
	},
	infoStyle:{
		fontSize:10,
		padding: 2,
		textAlign: 'center',
		backgroundColor: '#000000',
		opacity:0.8,
		color: 'white'
	},
	emptyStyle:{
		  flex:1,
	},
});

// var propTypes = {
//     uri: PropTypes.string,
// 	width:PropTypes.number,
// 	height:PropTypes.number,
// 	isVip:PropTypes.bool,
// 	isFree:PropTypes.bool,
// 	info:PropTypes.string,
// };

var MyImage = React.createClass (
	{
		
		render:function()
		{
			var info = this.props.info.length>20?(this.props.info.substr(0,20) + '...'):(this.props.info)
			var imageWidth = this.props.width - 2 * 8;
			return (
       			<View style		= {{
							flex: 1, 
						  	justifyContent: 'center', 
						  	alignItems: 'center',
						 	width: this.props.width, 
							height: this.props.height}}>
	  		  		<Image 
						style 	= {{
							width: imageWidth,
							height: this.props.height,
						 	backgroundColor: 'transparent'}}
							
	            		source 	= {{uri: this.props.uri}}>
							
						<View style 	= {{height: this.props.height}}>
							<View style 	= {{width: this.props.width, flexDirection: 'row'}}>
								{
									this.props.isFree?<Image style 	= {Style.freeStyle} source 	= {require('../img/free_icon.png')}/>:null
								}
								<View style 	= {Style.emptyStyle}/>
								{
									this.props.isVip?<Text style={Style.vipStyle}>VIP</Text>:null
								}
							</View>
						
							<View style 	= {Style.emptyStyle}/>
						
							<View style 	= {{width: this.props.width, flexDirection: 'row'}}>
								<View style={Style.emptyStyle}/>
								{
									this.props.showInfo?(
										<Text 
											style 	= {Style.infoStyle}>
											{
												//info
											}
										</Text>):
										(null)
								}
								
							</View>
	            		</View>
	          		</Image>
        		</View>
			);
		}
	}
);

module.exports = MyImage;




// <MyImage uri={'http://117.131.17.27:8080/vomsimages/image/70/70/593.jpg'}
// 		 height={100}
// 		 width={200}
// 		 isVip={true}
// 		 isFree={true}
// 		 info={'更新至10集'}/>