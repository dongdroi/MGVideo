'use strict';

import React from 'react-native';
const {
	ToastAndroid,
	Platform
} = React;

export function ToastShort(content) {
	if (Platform.OS == "android")
	ToastAndroid.show(new String(content), ToastAndroid.SHORT);
}

export function ToastLong(content) {
	if (Platform.OS == "android")
	ToastAndroid.show(new String(content), ToastAndroid.LONG);
}