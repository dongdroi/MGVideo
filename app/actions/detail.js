'use strict';

import * as types from '../constants/ActionTypes';
import {ToastShort} from '../utils/ToastUtils';
import {request} from '../utils/RequestUtils';
import {GET_PROGRAME_SERVLET, GET_PLAYBILL_SERVLET, GET_PLAYURLPATH_SERVLET} from '../constants/Urls';

Date.prototype.format = function(fmt) { 
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  

export function fetchDetail(programId) {
	console.log('fetchDetail programeId = ' + programId);
	return dispatch => {
		dispatch(fetchNodeDetail());
		return request(GET_PROGRAME_SERVLET + '?programeId=' + programId, 'get')
			.then((nodeDetail) => {
			 	//console.log('fetchDetail nodeDetail = ' + nodeDetail);
				//如果是电视剧/综艺界面，直接获取第一集信息
				if (nodeDetail.fields.SerialCount > 0) {
					var serialIds = nodeDetail.fields.SubSerial_IDS.split(',');
					dispatch(fetchNodeContent(serialIds[0], nodeDetail));
				 	//综艺选集
					if (nodeDetail.fields.DISPLAYTYPE == '1005') {
						for (var i = 0; i < 3; i++) {
							dispatch(fetchNodeRelated(serialIds[i]));
						}
					}
				} else if (nodeDetail.fields.DISPLAYTYPE == '500020') {
					dispatch(receiveNodeDetail(nodeDetail));
					//获取真实播放链接
					if (nodeDetail.fields.mediafiles != '') {
						var visitPath = nodeDetail.fields.mediafiles.mediafile[1].visitPath;
						var contentId = nodeDetail.fields.MMS_ID;
						dispatch(fetchVideoPath(visitPath, contentId));
					}
				 	dispatch(fetchPlayBill(nodeDetail.fields.MMS_ID));
			    } else {
					if (nodeDetail.fields.SerialContentID == '') {
						dispatch(receiveNodeDetail(nodeDetail));
					} else {
						dispatch(receiveNodeContent(nodeDetail));
					}
					//获取真实播放链接
					if (nodeDetail.fields.mediafiles != '') {
						var visitPath = nodeDetail.fields.mediafiles.mediafile[1].visitPath;
						var contentId = nodeDetail.fields.MMS_ID;
						dispatch(fetchVideoPath(visitPath, contentId));
					}
				}
				
			})
			.catch((error) => {
				//dispatch(receiveNodeDetail({}));
				ToastShort(error.message);
			})
	}
}

export function clearDetail() {
	return dispatch => {
		dispatch(clearNodeDetail());
	}
}
 
export function fetchNodeContent(programeId, nodeDetail) {
	return dispatch => {
		return request(GET_PROGRAME_SERVLET + '?programeId=' + programeId, 'get')
			.then((nodeContent) => {
				//console.log('fetchNodeContent nodeContent = ' + nodeContent);
				dispatch(receiveNodeContent(nodeContent, nodeDetail));
			 	//获取真实播放链接
				if (nodeContent.fields.mediafiles != '') {
					var visitPath = nodeContent.fields.mediafiles.mediafile[1].visitPath;
					var contentId = nodeContent.fields.MMS_ID;
					dispatch(fetchVideoPath(visitPath, contentId));
				}
			})
			.catch((error) => {
				//dispatch(receiveNodeContent({}));
				ToastShort(error.message);
			});
	};
}
 
export function fetchNodeRelated(programeId) {
	return dispatch => {
		return request(GET_PROGRAME_SERVLET + '?programeId=' + programeId, 'get')
			.then((nodeContent) => {
				console.log('fetchNodeRelated nodeContent = ' + nodeContent);
				dispatch(receiveNodeRelated(nodeContent));
			})
			.catch((error) => {
				ToastShort(error.message);
			});
	};
} 

export function fetchPlayBill(contentId) {
	return dispatch => {
		return request(GET_PLAYBILL_SERVLET + '?contentId=' + contentId, 'get')
			.then((playBill) => {
				console.log('fetchPlayBill playBill = ' + playBill);
				dispatch(receivePlayBill(playBill));
			})
			.catch((error) => {
				ToastShort(error.message);
			});
	};
}

export function fetchVideoPath(visitPath, contentId, startTime, endTime) {
	var timestamp = new Date().format('yyyyMMddhhmmss');
 	var params = 'visitPath=' + visitPath + '&msisdn=3000000000000' + '&contentID=' + contentId 
	 	+ '&timestamp=' + timestamp;
    if (startTime != undefined && endTime != undefined) {
		params = params + '&otherPara=$playbackbegin=' + startTime + '$playbackend=' + endTime;
	}
	return dispatch => {
		return request(GET_PLAYURLPATH_SERVLET, 'POST', params)
			.then((response) => {
				//console.log('fetchVideoPath response = ' + response);
				dispatch(receiveVideoPath(response.playUrl));
			})
			.catch((error) => {
				ToastShort(error.message);
			});
	};
} 
 
function fetchNodeDetail() {
	return {
		type: types.FETCH_NODE_DETAIL
	}
}

function receiveNodeDetail(nodeDetail) {
	return {
		type: types.RECEIVE_NODE_DETAIL,
		nodeDetail: nodeDetail
	}
}

function receiveNodeContent(nodeContent, nodeDetail) {
	return {
		type: types.RECEIVE_NODE_CONTENT,
		nodeDetail:	nodeDetail,
		nodeContent: nodeContent
	}
}

function receiveNodeRelated(nodeContent) {
	return {
		type: types.RECEIVE_NODE_RELATED,
		node: nodeContent,
	}
}

function receivePlayBill(playBill) {
	return {
		type: types.RECEIVE_PLAY_BILL,
		playBill: playBill,
	}
}

function receiveVideoPath(videoPath) {
	return {
		type: types.RECEIVE_VIDEO_PATH,
		videoPath: videoPath,
	}
}

function clearNodeDetail() {
	return {
		type: types.CLEAR_NODE_DETAIL
	}
}