/**
 * Created by sean on 16-1-15.
 */

(function(win){
    var _version = 1.0,
        debug = true,
        _objects = {},
        _id = 1;

    function gojs(data){
        this._data = data;
        this._events = {};
    }

    var Go = win.Go = function(data){
        var obj;
        data = data || Go;
        Go.each(_objects, function(_obj, key){
            if(_obj._data === data){
                obj = _objects[key];
            }
        });
        if(Go.isEmpty(obj)){
            obj = _objects[Go.getId('event_')] = new gojs(data);
        }
        return obj;
    };

    var _proto = gojs.prototype;

    _proto.bind = function(name, callback){
        this._events[name] = this._events[name] || [];
        this._events[name].push(callback);
    };

    _proto.trigger = function(name){
        var _data = this._data;
        var _events = this._events;
        Go.each(_events[name], function(_event, index){
            if(Go.isEmpty(_event)){
                return;
            }
            var fun = _event, _args = [];
            if(Go.isArray(_event) && _event.length > 0){
                fun = _event[_event.length - 1];
                _args = Go.copy(_event).splice(0, _event.length -1);
            }
            if(Go.isFunction(fun)){
                fun.apply(_data, _args);
                _events[name][index] = undefined;
            }else{
                Go.log('callback is not function.', 'event');
            }
        });
    };

    function log(msg, title){
        title = title || 'log:';
        var str= msg;
        if(typeof msg === 'object' && !!msg){
            str = JSON.stringify(msg);
        }
        if(debug === true){
            console.log(title +": "+str);
        }
    }

    Go.log = log;

    Go.version = function(){
        return _version;
    };

    Go.keys = function(data){
        return Object.keys(data);
    };

    Go.isArray = function(data){
        return Array.isArray(data);
    };

    Go.isObject = function(data){
        var type = typeof data;
        return type === 'function' || type === 'object' && !!data;
    };

    Go.each = Go.forEach = function(data, fun){
        if(Go.isObject(data) || Go.isArray(data)){
            var keys = Go.keys(data), i, length;
            for (i = 0, length = keys.length; i < length; i++) {
                if(fun.call(this, data[keys[i]], keys[i]) === -1){
                    break;
                }
            }
        }
    };

    Go.each(['Arguments', 'Function', 'String', 'Date', 'RegExp', 'Error'], function(name) {
        Go['is' + name] = function(obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    });

    Go.isNumber = function(num){
        return isNaN(num) === false;
    };

    Go.isObject = function(data){
        var type = typeof data;
        return type === 'function' || type === 'object' && !!data ;
    };


    Go.isDefined = function(data){
        return typeof data !== 'undefined';
    };

    Go.isEmpty = function(data){
        if(!Go.isDefined(data) || data === null ){
            return true;
        }
        if(Go.isArray(data)){
            if(data.length === 0){
                return true;
            }
        }
        if(Go.isObject(data)){
            if(Go.keys(data).length === 0){
                return true;
            }
        }
        return false;
    };

    Go.microtime = function(){
        return new Date().getTime();
    };

    Go.time = function(){
        return Math.round(_proto.microtime() / 1000);
    };

    Go.trim = function (str){
　　     return str.replace(/(^\s*)|(\s*$)/g, "");
　　 };

    Go.map = function(data, fun){
        if(Go.isArray(data)){
            return data.map(fun);
        }else if(Go.isObject(data)){
            var keys = Go.keys(data), i, length, newObj ={};
            for (i = 0, length = keys.length; i < length; i++) {
                newObj[keys[i]] = fun.call(this, data[keys[i]], keys[i]);
            }
            return newObj;
        }
        log('Data is not Object or Array.');
        return data;
    };

    Go.urlEncode = function (param, key, encode) {
        function urlEncode(param, key, encode){
            if(Go.isEmpty(param)) return '';
            var paramStr = '';
            var t = typeof (param);
            if (t == 'string' || t == 'number' || t == 'boolean') {
                paramStr += '&' + key + '=' + ((Go.isEmpty(encode)||encode) ? encodeURIComponent(param) : param);
            } else {
                for (var i in param) {
                    var k = Go.isEmpty(key) ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                    paramStr += urlEncode(param[i], k, encode);
                }
            }
            return paramStr;
        }
        return urlEncode(param,key,encode).substr(1);
    };

    /**
     * Deepin clone an object
     * @param obj
     * @returns {*}
     *
     */
    Go.copy = function(obj, dest) {
        var copy = function(obj){
            if(Go.isObject(obj)) {
                if(Go.isArray(obj)) {
                    var newArr = [];
                    for(var i = 0; i < obj.length; i++) newArr.push(obj[i]);
                    return newArr;
                } else {
                    var newObj = {};
                    Go.each(obj, function(data, key){
                        newObj[key] = copy(obj[key]);
                    });
                    return newObj;
                }
            } else {
                return obj;
            }
        };

        var newObj = copy(obj);
        if(Go.isDefined(dest)){
            _.each(newObj, function(value, key){
                dest[key] = value;
            });
        }
        return newObj;
    };



    Go.defaults = function(obj, defaults){
        if(Go.isObject(defaults) && Go.isObject(obj)){
            Go.each(defaults, function(value, key){
                if(!Go.isDefined(obj[key])){
                    if(Go.isObject(defaults[key])){
                        obj[key] = Go.copy(defaults[key]);
                    }else{
                        obj[key] = defaults[key];
                    }

                }
            });
        }
        return obj;
    };

    Go.substr = function(arr, start, length){
        if(Go.isArray(arr)){
            arr = Go.copy(arr);
            return arr.splice(start, length);
        }else if(Go.isString(arr)){
            return arr.substr(start, length);
        }
        return arr;
    };

    Go.getRandStr = function (len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789_';
        var maxPos = $chars.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return (_id++ + pwd).substr(0, len);
    };

    Go.getId = function(key){
        key = key || '';
        return key + _id++;
    };

    Go.random = function (Min,Max){
        var Range = Max - Min;
        var Rand = Math.random();
        return(Min + Math.round(Rand * Range));
    };

    /**
     *
     * @param mask 时间格式
     * @param time 毫秒时间戳或格式化时间(2015/01/01 00:00:00)
     * @returns {string|void|XML}
     */
    Go.date = function(mask, timestamp) {

        var d = new Date(timestamp);

        var zeroize = function (value, length) {

            if (!length) length = 2;

            value = String(value);

            for (var i = 0, zeros = ''; i < (length - value.length); i++) {

                zeros += '0';

            }

            return zeros + value;

        };

        return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function($0) {

            switch($0) {

                case 'd':   return d.getDate();

                case 'dd':  return zeroize(d.getDate());

                case 'ddd': return ['Sun','Mon','Tue','Wed','Thr','Fri','Sat'][d.getDay()];

                case 'dddd':    return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()];

                case 'M':   return d.getMonth() + 1;

                case 'MM':  return zeroize(d.getMonth() + 1);

                case 'MMM': return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];

                case 'MMMM':    return ['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()];

                case 'yy':  return String(d.getFullYear()).substr(2);

                case 'yyyy':    return d.getFullYear();

                case 'h':   return d.getHours() % 12 || 12;

                case 'hh':  return zeroize(d.getHours() % 12 || 12);

                case 'H':   return d.getHours();

                case 'HH':  return zeroize(d.getHours());

                case 'm':   return d.getMinutes();

                case 'mm':  return zeroize(d.getMinutes());

                case 's':   return d.getSeconds();

                case 'ss':  return zeroize(d.getSeconds());

                case 'l':   return zeroize(d.getMilliseconds(), 3);

                case 'L':   var m = d.getMilliseconds();

                    if (m > 99) m = Math.round(m / 10);

                    return zeroize(m);

                case 'tt':  return d.getHours() < 12 ? 'am' : 'pm';

                case 'TT':  return d.getHours() < 12 ? 'AM' : 'PM';

                case 'Z':   return d.toUTCString().match(/[A-Z]+$/);

                // Return quoted strings with the surrounding quotes removed

                default:    return $0.substr(1, $0.length - 2);

            }

        });

    };







})(window);
