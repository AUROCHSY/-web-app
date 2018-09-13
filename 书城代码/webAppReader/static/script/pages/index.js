//连通界面与数据接口
$.get('/ajax/index',function(d){//接口的的数据返回格式可以通过打debugger在develop tool上查看 
	debugger; 
	new Vue({
		el:'#app',//绑定作用域:id为app的元素内(包含子元素) 
		data:{/*首页服务端数据绑定*/
			//test:"测试数据",将右边的值赋值给左边的变量 
			top:d.items[0].data.data,//顶部轮播图
			hot:d.items[1].data.data,//热门书籍数据
			recommend:d.items[2].data.data,//推荐书籍数据
			female:d.items[3].data.data,
			male:d.items[4].data.data,
			free:d.items[5].data.data,
			topic:d.items[6].data.data,//专题

		}
	})
},'json')//指定接口的数据返回格式 