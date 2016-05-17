'use strict';

import * as types from '../constants/ActionTypes';

const initialState = {
	loading: false,
	nodeDetail: {},		  //电影，剧集列表
	nodeContent: {},      //电视剧
	nodeRelated: [],	  //综艺选集
	playBill: {},		  //直播节目单
	videoPath: '',		  //实际播放链接
}

export default function detail(state = initialState, action) {
	console.log("detail action = " + action.type + "," + action.nodeDetail);
	switch (action.type) {
		case types.FETCH_NODE_DETAIL:
			return Object.assign({}, state, {
				loading: true
			});
		case types.RECEIVE_NODE_DETAIL:
			return Object.assign({}, state, {
				loading: true,
				nodeDetail: action.nodeDetail
			});
		case types.RECEIVE_NODE_CONTENT:
			if (action.nodeDetail == undefined) {
				return Object.assign({}, state, {
					loading: false,
					nodeContent: action.nodeContent
				});	
			} else {
				return Object.assign({}, state, {
					loading: false,
					nodeDetail: action.nodeDetail,
					nodeContent: action.nodeContent
				});
			}
		case types.RECEIVE_NODE_RELATED:
			var related = state.nodeRelated;
			related.push(action.node);
			return Object.assign({}, state, {
				nodeRelated: related,
			});
		case types.RECEIVE_PLAY_BILL:
			return Object.assign({}, state, {
				playBill: action.playBill,
			});
		case types.RECEIVE_VIDEO_PATH:
			return Object.assign({}, state, {
				videoPath: action.videoPath,
			});
		case types.CLEAR_NODE_DETAIL:
			return Object.assign({}, state, {
				loading: false,
				nodeDetail:  {},
				nodeContent: {},
				nodeRelated: [],
				playBill:	 {},
				videoPath:   '',
			});
		default:
			return state;
	}
}
