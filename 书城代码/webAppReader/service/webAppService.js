var fs = require('fs');//添加访问文件系统功能

/*10.4为网站添加Mock数据接口*/
exports.get_test_data = function(){//定义get_test_data函数,Node.js的语法
	var content = fs.readFileSync('./mock/testData.json','utf-8');
	return content;
}

/*10.5为网站添加接口之线上HTTP接口调用*/
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

/*10.6网站服务端Ajax接口的完整开发*/
//主页服务层
exports.get_index_data = function(){//Node.js的语法
	var content = fs.readFileSync('./mock/home.json','utf-8');
	return content;
}

//排序页服务层
exports.get_rank_data = function(){//Node.js的语法
	var content = fs.readFileSync('./mock/rank.json','utf-8');
	return content;
}

//男频页服务层
exports.get_male_data = function(){//Node.js的语法
	var content = fs.readFileSync('./mock/channel/male.json','utf-8');
	return content;
}
//女频页服务层
exports.get_female_data = function(){//Node.js的语法
	var content = fs.readFileSync('./mock/channel/female.json','utf-8');
	return content;
}

//目录页服务层
exports.get_category_data = function(){//Node.js的语法
	var content = fs.readFileSync('./mock/category.json','utf-8');
	return content;
}

//书籍详情页(需要传参数书籍id)
exports.get_book_data = function(id){//Node.js的语法
	if(!id){//如果传过来的id是空的，设为默认书籍
		id="18218";
		if(fs.existsSync('./mock/book/' + id + '.json')){
			return fs.readFileSync('./mock/book/' + id + '.json', 'utf-8');
		}else{
			return fs.readFileSync('./mock/book/18218.json', 'utf-8');
		}
	}
	
	var content = fs.readFileSync('./mock/book/'+id+'.json','utf-8');
	return content;
}

