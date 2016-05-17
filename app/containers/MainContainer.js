'use strict';

import React from 'react-native';
const {
  Component
} = React;
import {connect} from 'react-redux';
import Main from '../Main';
import Storage from '../utils/Storage';

let typeIds = [0, 12, 9, 2];

class MainContainer extends Component {
  componentDidMount() {
    Storage.get('isInit')
      .then((isInit) => {
        if (!isInit) {
          Storage.save('typeIds', typeIds);
          Storage.save('isInit', true);
        }
      });
  }

  render() {
    return (
        <Main {...this.props} />
    )
  }
}

function mapStateToProps(state) {
  const {read} = state;
  return {
    read
  }
}

export default connect(mapStateToProps)(MainContainer);
