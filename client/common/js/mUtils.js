/**
 * 公共方法
 * */

/**
 * 存储localStorage
 */
export const setLocalStorage = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
export const getLocalStorage = name => {
	if (!name) return;
	let data = window.localStorage.getItem(name)

	return data ? JSON.parse(data) : undefined;
}

/**
 * 删除localStorage
 */
export const removeLocalStorage = name => {
	if (!name) return;
	window.localStorage.removeItem(name);
}


export const Cookie = {
	/**
	 * getCookie
	 * @param name
	 * @returns {*}
	 */
	get(name) {
		var strCookie = document.cookie;
		var arrCookie = strCookie.split("; ");
		for (var i = 0; i < arrCookie.length; i++) {
			var arr = arrCookie[i].split("=");
			if (arr[0] == name) return arr[1];
		}
		return "";
	},

	/**
	 * 添加cookie
	 * @param name
	 * @param value
	 * @param expiresHours
	 * @param domain
	 */
	set(name, value, expiresDays, domain, path) {
		var cookieString = name + "=" + (value ? value : '');
		var date = new Date();

		if (domain != undefined)
			domain = ";domain=" + domain;
		else
			domain = '';

		date.setTime(date.getTime() + (expiresDays || 1) * 24 * 3600 * 1000);
		cookieString = cookieString + domain + "; path="+ (path || "/") +"; expires=" + date.toGMTString();

		document.cookie = cookieString;
	},

	/**
	 * 删除cookie
	 * @param name
	 */
	remove(name) {
		this.set(name, '', -1);
	}
};


export function dataURItoBlob (dataURI) {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	var byteString = atob(dataURI.split(',')[1])

	// separate out the mime components
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

	// write the bytes of the string to an ArrayBuffer
	var ab = new ArrayBuffer(byteString.length)

	// create a view into the buffer
	var ia = new Uint8Array(ab)

	// set the bytes of the buffer to the correct values
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i)
	}

	// write the ArrayBuffer to a blob, and you're done
	var blob = new Blob([ab], { type: mimeString })
	return blob
}
/** 换算文件单位
 * @param limit 单位B 
*/
export function transFileSize(limit){
	let size = "";
	if(limit <  1024){                            //小于1KB，则转化成B
	  size = limit.toFixed(2) + "B"
	}else if(limit <  1024 * 1024){            //小于1MB，则转化成KB
	  size = (limit/1024).toFixed(2) + "KB"
	}else if(limit <  1024 * 1024 * 1024){        //小于1GB，则转化成MB
	  size = (limit/(1024 * 1024)).toFixed(2) + "MB"
	}else{                                            //其他转化成GB
	  size = (limit/(1024 * 1024 * 1024)).toFixed(2) + "GB"
	}

	var sizeStr = size + "";                        //转成字符串
	var index = sizeStr.indexOf(".");                    //获取小数点处的索引
	var dou = sizeStr.substr(index + 1 ,2)            //获取小数点后两位的值
	if(dou == "00"){                                //判断后两位是否为00，如果是则删除00
	  return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
	}
	return size;
  }
