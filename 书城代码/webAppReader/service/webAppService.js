var fs = require('fs');//添加访问文件系统功能

exports.get_test_data = function(){//Node.js的语法
	var content = fs.readFileSync('./mock/testData.json','utf-8');
	return content;
}

exports.get_search_data = function(start, end, keyword) {//这三个参数是分别是开始结束页码，搜索关键字，小米书城的接口就是这样，就得这样写
	return function(cb) {//因为是一个异步的http的接口，所以要返回一个异步函数
		var http = require('http');//自带的http模块，这里用于发送请求
		var qs = require('querystring');//把对象转为http的查询参数object
		//比如js里{"a":"1"}这样的object，并不能被后端接受到，要转为http://127.0.0.1/api?a=1这样的格式	
		
		var data = {//用传入的参数创建json对象
			s: keyword,
			start: start,
			end: end
		};
		
		var content = qs.stringify(data);//将json对象转格式为http的传参格式
		
		//request头，指定发送的接口地址，端口，路径(路由的位置)，方法
		var http_request = {
			hostname: 'dushu.xiaomi.com',
			port: 80,
			path: '/store/v0/lib/query/onebox?' + content,
			method: 'GET'
		};

		req_obj = http.request(http_request, function(_res) {//参数是响应对象
			var content='';//用于保存返回的内容
			_res.setEncoding('utf8');

			_res.on('data', function(chunk) {//监听到数据返回后，触发data方法。这里的chunk是一批数据，数据是分批返回的
				content += chunk;
			});

			_res.on('end', function(e) {//触发end事件后才将全部数据返回
				cb(null,content);//这是callback方法，参数1是错误代码(这里写null最简单)，参数2是返回的内容
			});

		});

		req_obj.on('error', function(e) {//监听响应出错的情况

		});

		req_obj.end();//发送请求
	}
}
