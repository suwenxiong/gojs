/**
 * Created by sean on 16-1-15.
 */

(function(win){
    var _version = 1.0,
        debug = true,
        _id = 1;

    var Go = win.Go = {};

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

    Go.isFunction = function(data){
        return typeof data === 'function';
    };

    Go.isDefined = function(data){
        return typeof data === 'undefined';
    };

    Go.isEmpty = function(data){
        if(data == null || data == false){
            return true;
        }
        if(Go.isArray(data)){
            if(data.length === 0){
                return true;
            }
        }
        if(Go.isObject(data)){
            if(Go.keys(data) == false){
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

    Go.each = Go.forEach = function(data, fun){
        if(Go.isArray(data)){
            return data.forEach(fun);
        }else if(Go.isObject(data)){
            var keys = Go.keys(data), i, length;
            for (i = 0, length = keys.length; i < length; i++) {
                fun.call(this, data[keys[i]], keys[i]);
            }
            return true;
        }
        log('Data is not Object or Array.');
        return data;
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
    }

    Go.urlEncode = function (param, key, encode) {
        function urlEncode(param, key, encode){
            if(param==null) return '';
            var paramStr = '';
            var t = typeof (param);
            if (t == 'string' || t == 'number' || t == 'boolean') {
                paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
            } else {
                for (var i in param) {
                    var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                    paramStr += urlEncode(param[i], k, encode);
                }
            }
            return paramStr;
        }
        return urlEncode(param,key,encode).substr(1)
    };

    /**
     * Deepin clone an object
     * @param obj
     * @returns {*}
     *
     */
    Go.copy = function(obj) {
        if(Go.isObject(obj)) {
            if(Go.isArray(obj)) {
                var newArr = [];
                for(var i = 0; i < obj.length; i++) newArr.push(obj[i]);
                return newArr;
            } else {
                var newObj = {};
                Go.each(obj, function(data, key){
                    newObj[key] = Go.copy(obj[key]);
                });
                return newObj;
            }
        } else {
            return obj;
        }
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