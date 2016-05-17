'use strict';

import React from 'react-native';
const {
  Component
} = React;
import {connect} from 'react-redux';

import VideoPlayer from './VideoPlayer';

class VideoContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <VideoPlayer {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const {detail} = state;
  return {
    detail
  }
}

export default connect(mapStateToProps)(VideoContainer);
