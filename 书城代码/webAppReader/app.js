var koa = require('koa');//引入koa模块

var controller = require('koa-route');//10.1提供路由功能，相当于java的控制器

var app=koa();//实例化

var views=require('co-views');//10.2提供模板渲染功能
var render =views('./view',{
    map : {html : 'ejs'}
});//实例化views,参数1是模板访问路径(注意斜杠前的点，因为路径默认是根目录)，参数2是指定模板文件类型后缀和模板类型

var koa_static=require('koa-static-server');//10.3提供静态资源访问功能的中间件
//如果没添加一个新文件就写一个路由也行，不过这样太麻烦了

var service = require('./service/webAppService.js');//10.4引入自己写的服务层文件

var querystring=require('querystring');//10.5用于实现http格式参数转为object格式

/*10.1.设置一个route*/
//当访问/route_test路径时，网页返回相应内容
//koa的这个中间件接受的函数是一个generator
app.use(controller.get('/route_test',function*(){
    this.set('Cache-Control','no-cache');//设置HTTP返回头，不缓存内容
    this.body='hello koa!';//设置返回的内容
}));

//运行结果：运行该程序，到地址栏访问 localhost:3001/route_test 页面会显示hello koa字样


/*10.2.实现模板渲染功能 */
app.use(controller.get('/ejs_test',function*(){
    this.set('Cache-Control','no-cache');//设置HTTP返回头，不缓存内容
    this.body=yield render('testmodel',{title:'title_test'});
    //yield语句 是es6的语言特性generator函数，用于完成异步函数的执行，阮一峰的博客介绍得比较详细
    //render的参数1是模板(html文件)的名字,在初始化render时设置的路径里寻找，参数2是传入模板的"变量:变量值"键值对

}));

//运行结果：运行该程序，到地址栏访问 localhost:3001/ejs_test 页面会显示testmodel.html文件里的内容

/*10.3.实现静态资源访问功能 */
app.use(koa_static({
    rootDir:'./static/',//实际访问的服务器中的路径
    rootPath:'/s/',//地址栏中输入的路径
    maxage:0 //缓存有效时间
}));

//运行结果：运行该程序，到地址栏访问 localhost:3001/s/staticVisitTest.html 页面会显示staticVisitTest.html文件里的内容

/*10.4 为网站添加Mock(模拟的)数据接口 */
app.use(controller.get('/api_test',function*(){
	this.set('Cache-Control','no-cache');
	this.body = service.get_test_data();
}));

//运行结果：运行该程序，到地址栏访问 localhost:3001/api_test 页面会显示testData.json文件里的内容

/*10.5 为网站添加接口之线上HTTP接口调用 */
app.use(controller.get('/ajax/search',function*(){
	this.set('Cache-Control','no-cache');
	var params = querystring.parse(this.req._parsedUrl.query);//将http参数转为object格式
	var start = params.start;
	var end = params.end;
	var keyword = params.keyword;
	this.body = yield service.get_search_data(start,end,keyword);
}));



app.listen(3002);//设置监听端口
console.log('koa server is started');