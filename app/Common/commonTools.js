'use strict'

import React, {
  PixelRatio
} from 'react-native';

var Dimensions = require('Dimensions');

var CommonTools = {
  pixel: 1/PixelRatio.get(),
  screenWidth: Dimensions.get('window').width,
  screenHeight: Dimensions.get('window').height,
  designWidth:750,
  designHeight:1334,

  actualWidth(width) {
    return (
      1.0*width/320.0*this.screenWidth
    );
  },

  actualHeight(height) {
    return (
      1.0*height/568.0*this.screenHeight
    )
  },

  post(url, data, successCallback, failCallback) {
    var fetchOptions = {
      method: 'POST',
      header: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    fetch(url, fetchOptions)
      .then(response => response.json())
      .then(json => {
        successCallback(json);
      })
      .catch(error => {
        failCallback(error);
      });
  },

  get(url, successCallback, failCallback) {
    fetch(url)
      .then(response => response.json())
      .then(json => {
        successCallback(json);
      })
      .catch(error => {
        failCallback(error);
      });
  },
  
  
  /**
  *next edit by tyq
  */
  myActualWidth (width) 
  {
    return (
		parseInt (width*this.screenWidth/this.designWidth)
    );
  },
  myActualHeight (height) 
  {
    return (
		parseInt (height*this.screenHeight/this.designHeight)
		
    );
  },
  
  myActualPageHeight ()
  {
	  return(this.screenHeight-(340*this.screenHeight/this.designHeight));
  },
  
  myDefaultImage ()
  {
  	return "http://117.131.17.27:8080/pomsimages/3010/873/972/V_CONTENT.jpg";
  },
  
  //去除字符串空格
  StringTrim:function(str)
  { 
	return str.replace(/(^\s*)|(\s*$)/g, "");
  },
  //去除字符串右边的空格
  StringRTrim:function(str)
  { 
	return str.replace(/(\s*$)/g, "");   
  },
  //去除字符串左边的空格
  StringLTrim:function(str)
  { 
	return str.replace(/(^\s*)/g, ""); 
  },
  
  
  
  
	isArray: function (v)
	{
		return toString.apply (v) === '[object Array]';
	},
	//use in WaterFallItem
	getImageUrlForWaterFallItem:function (data)
	{
		if (Object.prototype.toString.call (data.fields.IMAGES) === "[object String]")
		{
			return this.myDefaultImage ();
		}
		if (this.isArray (data.fields.IMAGES.image))
		{
			var tag 	= new Array ("_H32_sc","_HSJ720H","_HSJ1080H");
			for (var i in tag)
			{
				for (var j in data.fields.IMAGES.image)
				{
					if (data.fields.IMAGES.image[j].fileType.lastIndexOf (tag[i]) != -1)
					{
						return data.fields.IMAGES.image[j].src;
					}
				}
			}
			
			if (data.fields.IMAGES.image.length > 0)
			{
				return data.fields.IMAGES.image[0].src;
			}
		}
		return this.myDefaultImage ();
	},
	
	//use in LayoutImageItem
	getImageUrlForLayoutImageItem:function (data, width, height)
	{
		
		if (Object.prototype.toString.call (data.fields.IMAGES) === "[object String]")
		{//如果这个字段是String的话，那么代表图片为空，直接返回默认图片
			return this.myDefaultImage ();
		}
		if (this.isArray (data.fields.IMAGES.displayFile))
		{
			//横图标签
			var tag 	= new Array("_HSJ720H.jpg","HSJ1080H.jpg","V_CONTENT.jpg","TV_CONTENT.jpg","_HSJ720V.jpg","_V23_sc.jpg");
			if (height > width)//竖图标签
			{
				tag 	= new Array("V_CONTENT.jpg","TV_CONTENT.jpg","_HSJ720V.jpg","_V23_sc.jpg","_sc.jpg","_HSJ720H.jpg");
			}
			
			if (data)
			{
				for (var i in tag)
				{
					for (var j in data.fields.IMAGES.displayFile)
					{
						if (data.fields.IMAGES.displayFile[j].dpFileName &&
							data.fields.IMAGES.displayFile[j].dpFileName.lastIndexOf(tag[i]) != -1)
						{
							return data.fields.IMAGES.displayFile[j].dpFileName;
						}
					}
				}
			}
		}
		else if (data.fields.IMAGES.displayFile && data.fields.IMAGES.displayFile.dpFileName)
		{
			return data.fields.IMAGES.displayFile.dpFileName;
		}
		else if (this.isArray(data.fields.IMAGES.image))
		{
			var tag 	= new Array("_H32_sc","_HD");
			for (var i in tag)
			{
				for (var j in data.fields.IMAGES.image)
				{
					if (data.fields.IMAGES.image[j].fileType == tag[i])
					{
						return data.fields.IMAGES.image[j].src;
					}
				}
			}
			return data.fields.IMAGES.image[0].src;
		}
		else if (data.fields.IMAGES.image.src)
		{
			return data.fields.IMAGES.image.src;
		}
		
		
		return this.myDefaultImage ();
		
	},
	
	//use in LayoutImageItemForLive
	getImageUrlForLayoutImageItemForLive:function (data)
	{
		if (Object.prototype.toString.call (data.fields.IMAGES) === "[object String]")
		{//如果这个字段是String的话，那么代表图片为空，直接返回默认图片
			return this.myDefaultImage ();
		}
		if (this.isArray (data.fields.IMAGES.displayFile))
		{
			if (data)
			{

				for (var i in data.fields.IMAGES.displayFile)
				{
					if (data.fields.IMAGES.displayFile[i].dpFileName &&
						data.fields.IMAGES.displayFile[i].dpFileName.lastIndexOf("_H32_sc.jpg") != -1)
					{
						return data.fields.IMAGES.displayFile[i].dpFileName;
					}
				}
				
				for (var i in data.fields.IMAGES.displayFile)
				{
					if (data.fields.IMAGES.displayFile[i].dpFileName &&
						data.fields.IMAGES.displayFile[i].dpFileName.lastIndexOf("_sc.jpg") != -1 &&
						data.fields.IMAGES.displayFile[i].dpFileID.length <= 0)
					{
						return data.fields.IMAGES.displayFile[i].dpFileName;
					}
				}
				
			}
		}
		else if (data.fields.IMAGES.displayFile && data.fields.IMAGES.displayFile.dpFileName)
		{
			return data.fields.IMAGES.displayFile.dpFileName;
		}
		
		return this.myDefaultImage ();
		
	},
  
};

module.exports = CommonTools;
