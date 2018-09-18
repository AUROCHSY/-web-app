var id=location.href.split('?id=').pop();//用js正则取地址栏id，这是最简单的方法，1当然在别的地方不一定适用，比如说传了多个参数
//var id=18218;
$.get('/ajax/book?id='+id,function(d){
    //debugger;
    new Vue({
        el:'#app',
        data:d,
        methods:{
            readBook:function(){
                location.href = "/reader"
            } 
        }
    })
},'json');