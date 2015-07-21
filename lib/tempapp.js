(function($, _, undefined){
    /**
    * 使用方法，第一个参数是调用数据,第二个参数是模版配置，具体查看underscore api
    * 前台使用方法 <script class="template"  type="text/template" target="title">
    * 模版必须写在script标签里面，script要有class=template type="text/template" ,指定target可以将模版输入到指定选择器
    */
    _.mixin({  
        compileTmp : function (data, setting){
            data = data || {};        
            $("script[class=template]").each(function(){
                if($(this).attr('type') != 'text/template'){
                    return;
                }
                var target = $(this).attr('target') || null;
                var fun = _.template($(this).html(), setting);   
                if(target){
                    $(target).html(fun(data));
                }else{
                    $(this).after(fun(data));
                }
            })
        }
    });
    var data = {
        title: '我的网站', 
        name: 'kkk', 
        weight: 40, 
        len: 100, 
        username: '张看看'
        };
    $(document).ready(function(){
        _.compileTmp(data);
    })
})(jQuery, _)