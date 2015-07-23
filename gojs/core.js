/**
 * Created by Administrator on 2015/7/20.
 */
(function(root, fun){
    root.Gojs = fun(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
}(window, function(root, Gojs, _, $){
    var previousGojs = root.Gojs;
    Gojs.VERSION = '1.0.0';
    Gojs._controllers = {};
    var Server = Gojs.Server = {
        toUrl : function (param){
            return "/?" + _.map(param, function(value, key){
                    return key + "=" + value;
                }).join("&")
        },
        loadScript : function(obj){
            if(obj.file === undefined)return;
            if(obj.file.indexOf('Controller')){
                obj.file = '/controllers/' + obj.file;
            }else if(obj.file.indexOf('Model')){
                obj.file = '/models/' + obj.file;
            }
            var file = obj.file +'.js';
            var success = obj.success || function(){}
            var error = obj.error || function(){}
            $.getScript(file).done(success).fail(error);
        },
        loadView: function(file){
            file = (file || Get.c + "_" + Get.a) + '.html';
            var html = '';
            var error = error || function(){}
            $.ajax({
                url: this.fileCache('/views/'+ file ),
                success : function(r){
                    html = r;
                },
                error: error,
                async: false
            })
            return html;
        },
        fileCache : function(file, cache){
            if(Gojs.debug){
                file = Gojs.debug ? file + '?random=' + Math.random() : file;
            }else{
                file = cache ? file : file + '?random=' + Math.random();
            }
            return file;

        }
    };

    var Get = Gojs.Get = {};

    var Cookie = Gojs.Cookie = {};

    var Router =  Gojs.Router = function(){
        var doamin = Server.domainUrl = document.domain;
        var http = Server.httpUrl = document.URL.indexOf('https://') !== -1 ? 'https://' : 'http://';
        var request = Server.requestUrl = document.URL.substr( (http + doamin).length);
        var key = request.indexOf('?');
        if(key !== -1){
            var querystr = request.substr(key + 1);
            var arr1=querystr.split('&');
            for  (i in arr1){
                var ta=arr1[i].split('=');
                Get[ta[0]]=ta[1];
            }
        }
        Get.c = Get.c || 'site';
        Get.a = Get.a || 'index';
        if(_.has(Get, 'gojs-debug')){
            Gojs.debug = true;
        }
        Gojs.ControllerName = Get.c + 'Controller';
        Gojs.ActionName = Get.a + 'Action';
        Server.loadScript({
            file :  Gojs.ControllerName,
            success : Gojs.Run
        });
    }



    var Log = Gojs.Log = function(message, type){
        type = type || 'error';
        if(type == 'error'){
            console.log(message);
        }else{
            console.log(message);
        }
    }

    var Controller = Gojs.Controller = function(options){
        options = _.defaults(this, {tagName: 'body'});
        _.extend(this, _.pick(options, ['tagName']));
    }

    _.extend(Controller.prototype, {
        render : function(file){
            var html = Gojs.Server.loadView(file);
            $(this.tagName).html(_.template(html));
        }
    })

    var Model = Gojs.Model = function(){

    }

    var View = Gojs.View = function(){

    }

    var extend = function(protoProps, staticProps) {
        var parent = this;
        var child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function(){ return parent.apply(this, arguments); };
        }

        // Add static properties to the constructor function, if supplied.
        _.extend(child, parent, staticProps);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _.extend(child.prototype, protoProps);

        // Set a convenience property in case the parent's prototype is needed
        // later.
        child.__super__ = parent.prototype;

        return child;
    };

    // Set up inheritance for the model, collection, router, view and history.
    Model.extend = Controller.extend = Router.extend = View.extend = History.extend = extend;

    Gojs.Run = function(){

        if(Gojs.ControllerName in Gojs._controllers){
            var C = new Gojs._controllers[Gojs.ControllerName];
            console.dir(Gojs._controllers[Gojs.ControllerName])
            console.dir(C);
            if(Gojs.ActionName in C){
                C[Gojs.ActionName]();
            }else{
                Log('不存在' + Get.a + 'Action');
            }

        }else{
            Log('不存在' + Get.c + "控制器");
        }

    }
    return Gojs;

}));

