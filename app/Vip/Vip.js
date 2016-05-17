'use strict';
var React = require('react-native');

var {
	Text,
	View,
	ListView,
	ActivityIndicatorIOS
} = React;

var Style = React.StyleSheet.create({
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

var Vip = React.createClass (
	{
		render:function()
		{
			return (
       			<View style={Style.container}>
          			<Text>Vip</Text>
        		</View>
			);
		}
	}
);

module.exports = Vip;