'use strict';
var IP_ADDRESS 	= "http://117.131.17.27:8081";

function api(api)
{
	return IP_ADDRESS + api;
}

// 获取节目信息：
// http://117.131.17.27:8081/miguportal/getProgrameServlet
function getProgrameServlet (programeId)
{
	return api ('/miguportal/getProgrameServlet?programeId=' + programeId);
}

// 获取直播节目单：
// http://117.131.17.27:8081/miguportal/getPlayBillServlet
function getPlayBillServlet (contentId)
{
	return api ('/miguportal/getPlayBillServlet?contentId=' + contentId);
}
 
// 获取栏目信息：
// http://117.131.17.27:8081/miguportal/getNodeServlet
function getNodeServlet (nodeId)
{
	return api ('/miguportal/getNodeServlet?nodeId=' + nodeId);
}
 
// 内容对象获取：
// http://117.131.17.27:8081/miguportal/getContentObjectServlet
function getContentObjectServlet (nodeId)
{
	return api ('/miguportal/getContentObjectServlet?nodeId=' + nodeId);
}
 
// 获取播放地址：
// http://117.131.17.27:8081/miguportal/getPlayUrlPathServlet
function getPlayUrlPathServlet (visitPath)
{
	return api ('/miguportal/getPlayUrlPathServlet?visitPath=' + visitPath);
}
 
// voms图片路径：
// http://117.131.17.27:8080/vomsimages/
function getVomsimages ()
{
	return api ('/vomsimages/'); 
}
// poms图片路径：
// http://117.131.17.27:8080/pomsimages/
function getPomsimages ()
{
	return api ('/pomsimages/'); 
}


module.exports 	= {
	ProgrameServlet:getProgrameServlet,
	PlayBillServlet:getPlayBillServlet,
	NodeServlet:getNodeServlet,
	ContentObjectServlet:getContentObjectServlet,
	PlayUrlPathServlet: getPlayUrlPathServlet,
	Vomsimages: getVomsimages,
	Pomsimages:getPomsimages
};