'use strict';

import * as types from '../constants/ActionTypes';
import {ToastShort} from '../utils/ToastUtils';
import {request} from '../utils/RequestUtils';
import {GET_NODE_SERVLET,GET_CONTENT_OBJECT_SERVLET} from '../constants/Urls';

export function fetchNodes(isRefreshing, loading, nodeId) {
	//console.log("fetchNodes 1 nodeId = " + nodeId);
	return dispatch => {
		dispatch(fetchNodeList(isRefreshing, loading));
		return request(GET_NODE_SERVLET + '?nodeId=' + nodeId, 'get')
				.then((nodeList) => {
					//dispatch(receiveNodeList(nodeList.childNodeNets.nodeNet, loading, 0));
					dispatch(fetchMovies(nodeList.childNodeNets.nodeNet));
				})
				.catch((error) => {
					//dispatch(receiveNodeList([], 0));
					console.log('fetchNodes ToastShort msg = ' + error.message);
					//ToastShort(error.message);
				});
	}
}

function fetchMovies(_nodeList) {
  return dispatch => {
		dispatch(fetchMovieList(false, true));
		_nodeList.forEach((node) => {
				//console.log("node id = " + node.nodeId + ",path = " + node.namePath);
				request(GET_CONTENT_OBJECT_SERVLET + '?nodeId=' + node.nodeId, 'get')
				.then((content) => {
					 if (content.contentObjectList.length > 1) {
						dispatch(receiveMovieList(content.contentObjectList, 0));
					}
				})
				.catch((error) => {
					console.log('fetchMovies ToastShort msg = ' + error.message);
					//ToastShort(error.message);
				});
		});
 	 }
}

function fetchNodeList(isRefreshing, loading) {
	return {
		type: types.FETCH_NODE_LIST,
		isRefreshing: isRefreshing,
		loading: loading,
	}
}

function fetchMovieList(isRefreshing, loading) {
	console.log('fetchMovieList ');
	return {
		type: types.FETCH_MOVIE_LIST,
		isRefreshing: isRefreshing,
		loading: loading,
	}
}

function receiveMovieList(movieList, typeId) {
	console.log('receiveMovieList ' + movieList.length + "," + typeId);
	return {
		type: types.RECEIVE_MOVIE_LIST,
		movieList: movieList,
		typeId: typeId,
	}
}