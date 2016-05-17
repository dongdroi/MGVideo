'use strict';
var React 	= require('react-native');

var {
	Text,
	View,
	ListView,
} = React;

var Style 	= React.StyleSheet.create(
{
	container: {
		backgroundColor: '#eeeeee',
		flex:1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	listView: {
		marginTop: 65,
		marginBottom: 0
	},
});

var Mine = React.createClass (
	{
		render:function()
		{
			return (
       			<View style={Style.container}>
          			<Text>Mine</Text>
        		</View>
			);
		}
	}
);

module.exports = Mine;