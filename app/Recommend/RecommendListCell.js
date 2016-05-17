
var React 			= require('react-native');
var Config 			= require('../Config/Config');
var LayoutImage 	= require('./LayoutImage');

import VideoContainer from '../containers/VideoContainer';

var {
	View,
	Text,
	TouchableHighlight,
	Image,
	InteractionManager,
} = React;

var Style = React.StyleSheet.create(
{
	container: 
	{
		flex:1,
		backgroundColor: 'white',
	},
});

module.exports = React.createClass(
{
	shouldComponentUpdate: function (nextProps, nextState) 
	{
		if (this.state.contentObjectLists == nextState.contentObjectLists) 
		{
			  return false;
		}
		return true;
	},
	
	getInitialState: function ()
	{
		return{
			contentObjectLists: null,
		  };
	},
	
	
    componentDidMount: function () 
	{
		this.fetchData ();
    },
	
	fetchDataSuccess:function (responseData)
	{
		this.setState({
			contentObjectLists:responseData[this.props.data.nodeId],
		});
	},
	fetchDataFail:function (error)
	{
		
	},
	
	fetchData:function ()
	{
		fetch (Config.ContentObjectServlet (this.props.data.nodeId))
		.then ((response) => response.json())
		.then ((responseData) => 
		{
			this.fetchDataSuccess (responseData);
        })
		.catch (error => 
		{
			this.fetchDataFail (error);
		})
		.done ();
	},
	
	onCilckItem:function (data)
	{
		console.log("name="+data.fields.PROGRAM_ID);
		
		//const {navigator} = this.props;
		InteractionManager.runAfterInteractions(() => {
			this.props.navigator.push({
				component: VideoContainer,
				name: 'VideoPlayer',
				programId: data.fields.PROGRAM_ID,    //616103953太阳的后裔 617039191澳门风云
			});
		});
	},
	onCilckTitle:function (data)
	{
		console.log("name="+data.PROGRAM_ID);
	},
	
	
	renderCell: function ()
	{
		if (this.state.contentObjectLists)
		{
			var showCount = this.props.data.showCount == ""?("100"):(this.props.data.showCount);
			return (
				<LayoutImage
					data 			= {this.state.contentObjectLists}
					showCount 		= {showCount}
					title 			= {this.props.data.name}
					onClick 		= {this.onCilckItem}
					value 			= {this.props.data.value}
					fatherData 		= {this.props.data}
					onCilckTitle 	= {this.onCilckTitle}>
				</LayoutImage>
			);
		}
	},
	
	render: function ()
	{
		return (
			<View 
				style 	= {Style.cellcontainer}>
				{this.renderCell()}
			</View>
		);
	},

});
