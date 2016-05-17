'use strict';

let HOST = 'http://117.131.17.27:8081/miguportal/';

export function request(url, method, body) {
  var isOk;
  return new Promise((resolve, reject) => {
    fetch(HOST + url, {
        method: method,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" 
        },
        body: body,
      })
      .then((response) => {
        if (response.ok) {
          isOk = true;
        } else {
          isOk = false;
        }
        return response.json();
      })
      .then((responseData) => {
        //console.log('response = ' + responseData);
        if (isOk) {
          resolve(responseData);
        } else {
          reject(responseData);
        }
      })
      .catch((error) => {
        reject(error);
      });
  })
}