/**
 * Created by Administrator on 2015/7/20.
 */
(function(root, fun){
    root.Gojs = fun(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
}(window, function(root, Gojs, _, $){
    var previousGojs = root.Gojs;
    Gojs.VERSION = '1.0.0';

    var Server = Gojs.Server = {};

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


    }


     Gojs.Run = function(){
        Router();
        var C = new Gojs.Controller[Get.c];
         C[Get.a + 'Action']();
    }

    var Controller = Gojs.Controller = function(){

    }

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

    return Gojs;

}));