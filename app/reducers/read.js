'use strict';

import * as types from '../constants/ActionTypes';

const initialState = {
	isRefreshing: false,
	loading: false,
	noMore: false,
	movieList: {}
}

export default function read(state = initialState, action) {
	console.log("read action = " + action.type);
	switch (action.type) {
		case types.FETCH_NODE_LIST:
			return Object.assign({}, state, {
				isRefreshing: action.isRefreshing,
				loading: action.loading,
			});
		case types.FETCH_MOVIE_LIST:
			return Object.assign({}, state, {
				isRefreshing: action.isRefreshing,
				loading: action.loading,
			});
		case types.RECEIVE_MOVIE_LIST:
			console.log('read action RECEIVE_MOVIE_LIST' + "," + action.movieList.length);
			return Object.assign({}, state, {
				isRefreshing: false,
				noMore: action.movieList.length == 0,
				movieList: (state.movieList[action.typeId] == undefined) ? 
						combine(state, action) : loadMore(state, action),
				loading: state.movieList[action.typeId] == undefined
			});
		default:
			return state;
	}
}

function combine(state, action) {
	//console.log("combine " + action.typeId);
	state.movieList[action.typeId] = action.movieList;
	return state.movieList;
}

function loadMore(state, action) {
	//console.log("loadMore " + action.typeId);
	state.movieList[action.typeId] = state.movieList[action.typeId].concat(action.movieList)
	return state.movieList;
}