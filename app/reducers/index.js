'use strict';

import {combineReducers} from 'redux';
import read from './read';
import detail from  './detail';

const rootReducer = combineReducers({
	read,
	detail
})

export default rootReducer;