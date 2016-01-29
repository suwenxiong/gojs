(function($){
    var temp = {}, viewPath, _ctrl ={};

    function getModuleByName(names, all){
        names = Go.copy(names);
        all = all || false;


        var obj = [];
        var m;
        if(all === true){
            m = [];
        }

        if(all){
            Go.each(names, function(name){

                obj.push(names.shift());
                m.push(temp[obj.join('.')]);
            });
        }else{
            return temp[names.join('.')];
        }

        return m;
    }

    function routerConvert(obj, prefix){
        prefix = prefix || [];

        Go.each(obj, function(router, moudleName){
            var newArr = Go.copy(prefix);
            newArr.push(moudleName);
            if(Go.isArray(router)){
                temp[newArr.join('.')] = {
                    key: newArr.join("."),
                    params: router,
                    tpl: viewPath + '/' + newArr.join('-') + '.html'
                };
            }else if(Go.isObject(router)){

                temp[newArr.join('.')] = {
                    key: newArr.join("."),
                    params: router.$params || [],
                    tpl: viewPath + '/' + newArr.join('-') + '.html'
                };
                if(Go.isDefined(router.$action)){

                    router.$action.forEach(function(action){
                        var tempArr = Go.copy(newArr);
                        tempArr.push(action);
                        temp[tempArr.join('.')] = {
                            key: tempArr.join("."),
                            params: [],
                            tpl: viewPath + '/' + tempArr.join('-') + '.html'
                        };
                    });
                }
                Go.each(router, function(obj, action){
                    var tempArr = Go.copy(newArr);
                    tempArr.push(action);
                    if(action[0] != '$'){
                        temp[tempArr.join('.')] = {
                            key: tempArr.join("."),
                            params: [],
                            tpl: viewPath + '/' + tempArr.join('-') + '.html'
                        }
                        routerConvert(obj, tempArr);
                    }
                })
            }
        })
    }

    function parseHtml(context, _this){
        var modules = _this.modules;
        var cur_m = modules.shift();
        var $html = $(context).find('gmodule:first');
        if($html.length <= 0){
            return;
        }
        if(Go.isObject(cur_m)){
            $.get(cur_m.tpl, function(r){
                $html.html(r);
                if(Go.isFunction(_this.ctrl[cur_m.key])){
                    _this.ctrl[cur_m.key].call($html);
                }
                parseHtml($html, _this);
            })
        }

    }


    var isStart = false;
    var grouter = window.grouter = function(params){

        var _this = this;
        var oldModule = [], oldParam= {};

        var defaults = {
            viewPath: 'views'
        };

        if(isStart){
            return false;
        }
        isStart = true;

        if(!Go.isObject(params)){
            params = {};
        }

        params = Go.defaults(params, defaults);
        viewPath = params.viewPath;
        Go.each(params, function(value, key){
            this[key] = value;
        });

        routerConvert(params.router);


        _this.ctrl = _ctrl;
        _this.params = {};

        window.onhashchange = run = function(){
            var hash = location.hash.substr(1);
            var data = hash.split("/");
            var moduleName = [];
            var isParam = false;
            var params = [];
            var newParams = {};

            Go.forEach(data, function(val){
                if(isParam === true){
                    params.push(val);
                    return;
                }
                if(/[a-z]+[a-z0-9-_]*/i.test(val)){
                    moduleName.push(val);
                    if(!Go.isDefined(temp[moduleName.join(".")])){
                        moduleName.pop();
                        params.push(val);
                        isParam = true;
                    }
                }
            })


            for(var i=0; i<params.length; i=i+2){
                newParams[params[i]] = params[1];
            }
            params = newParams;

            _this.modules = getModuleByName(moduleName, true);


            var context = document;
            Go.each(oldModule, function(name, index){
                if(moduleName[index] == name){
                    context = $(context).find('gmodule:first');
                    _this.modules.shift();
                }else{
                    return -1;
                }
            })

            parseHtml(context, _this);
            oldModule = moduleName;
            oldParam = params;



        }
        run();
    };

    grouter.controller = function(name, ctrl){
        _ctrl[name] = ctrl;
    };


})(jQuery);
