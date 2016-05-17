'use strict';

import React from 'react-native';
const {
	StyleSheet,
	PropTypes,
	ToolbarAndroid
} = React;
import StyleSheetPropType from 'StyleSheetPropType';
import ViewStylePropTypes from 'ViewStylePropTypes';

import {NaviGoBack} from '../utils/CommonUtils';

let ViewStylePropType = StyleSheetPropType(ViewStylePropTypes);

const propTypes = {
	title: PropTypes.string,
	actions: PropTypes.array,
	navigator: PropTypes.object,
	onActionSelected: PropTypes.func,
	onIconClicked: PropTypes.func,
	navIcon: PropTypes.number,
	customView: PropTypes.object
}

class ReadingToolbar extends React.Component {
	constructor(props) {
		super(props);
		this.onIconClicked = this.onIconClicked.bind(this);
		this.onActionSelected = this.onActionSelected.bind(this);
	}

	onIconClicked() {
		if (this.props.onIconClicked) {
			this.props.onIconClicked();
		} else {
			const {navigator} = this.props;
			if (navigator) {
				NaviGoBack(navigator);
			}
		}
	}

	onActionSelected(position) {
		this.props.onActionSelected();
	}

	render() {
		const {navigator} = this.props;
		if (this.props.customView) {
			return (
				<ToolbarAndroid style={styles.toolbar}>
					{this.props.customView}
        		</ToolbarAndroid>
			)
		} else {
			return (
				<ToolbarAndroid
					style={styles.toolbar}
					actions={this.props.actions}
					onActionSelected={this.onActionSelected}
					onIconClicked={this.onIconClicked}
					logo={this.props.logo ? this.props.logo : require('../img/icon_left.png')}
					titleColor='#000'
					title={this.props.title}
				/>
			);
		}
	}
}

let styles = StyleSheet.create({
	toolbar: {
    backgroundColor: '#ffffff',
    height: 56,
  }
})

ReadingToolbar.propTypes = propTypes;

ReadingToolbar.defaultProps = {
	onActionSelected: function() {},
	title: '',
	actions: []
}

export default ReadingToolbar;