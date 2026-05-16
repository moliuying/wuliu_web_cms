"use strict";
/*
 * require modules
 */
let Moment = require("moment");

const crypto = require('crypto');
const hash = crypto.createHash('md5');
let key = hash.update('sandygogoing').digest('hex');


let g_tools = {};
g_tools.limit = 10;
g_tools.aesEncrypt = (data) => {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

g_tools.aesDecrypt = (data) => {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}







module.exports = g_tools;


//我增加的新方法


const CaptchaSDK = require('dx-captcha-sdk')
g_tools.sdk = new CaptchaSDK('ce68320bea2394d36339185fb49d28a8', '9ec20d466ded1ec7a76c691505496c45')

// sdk.verifyToken(token).then(() => {
//     console.log('验证成功')
// }).catch(err => {
//     console.log('验证失败')
// })











/**
 * 时间转为秒
 * @param time 时间(00:00:00)
 * @returns {string} 时间戳（单位：秒）
 */
g_tools.Time_To_Sec = function (time) {
    var s = '';
    var hour = time.split(':')[0];
    var min = time.split(':')[1];
    var sec = time.split(':')[2];

    s = Number(hour * 3600) + Number(min * 60) + Number(sec);

    return s;
};

/**
 * 两日期相减得天数
 * @param data1  date类型
 * @param data2  date类型
 * @returns {Number}
 * @constructor
 */
g_tools.DateSubGetDay = function (data1, data2) {
    let days = data2.getTime() - data1.getTime();
    let day = parseInt(days / (1000 * 60 * 60 * 24));
    return day;
}

/**
 * 对象数组去重
 * @param array     对象数组
 * @param attribute 去重依据的对象属性
 * @returns {*}
 * @constructor
 */
g_tools.ObjArr_ToDuplicate = function (array, attribute) {
    let obj = {};
    array = array.reduce((cur, next) => {
        // console.log(next)
        if (next && next != null) {
            obj[next[attribute]] ? "" : obj[next[attribute]] = true && cur.push(next);
            return cur;
        }

    }, [])

    return array;
};

//两个时间相减得分钟
g_tools.TimeSubGetMin = function (time1, time2) {
    //console.log("TimeSubGetMin")
    //console.log(time1)
    //console.log(time2)
    let date1 = new Date(time1)
    let date2 = new Date(time2)

    let s1 = date1.getTime(),
        s2 = date2.getTime();
    let total = (s2 - s1) / 1000;
    //console.log(total)
    let day = parseInt(total / (24 * 60 * 60)); //计算整数天数
    let afterDay = total - day * 24 * 60 * 60; //取得算出天数后剩余的秒数
    let hour = parseInt(afterDay / (60 * 60)); //计算整数小时数
    let afterHour = total - day * 24 * 60 * 60 - hour * 60 * 60; //取得算出小时数后剩余的秒数
    let min = parseInt(afterHour / 60); //计算整数分
    //console.log(min)

    // var afterMin = total - day*24*60*60 - hour*60*60 - min*60;//取得算出分后剩余的秒数
    return min;
};


//判断当前日期为当月第几周
g_tools.getMonthWeek = function (a, b, c) {
    //a = d = 当前日期
    //b = 6 - w = 当前周的还有几天过完(不算今天)
    //a + b 的和在除以7 就是当天是当前月份的第几周
    var date = new Date(a, parseInt(b) - 1, c),
        w = date.getDay(),
        d = date.getDate();
    return Math.ceil((d + 6 - w) / 7);
};


g_tools.getDaysInOneMonth = function (year, month) {
    month = parseInt(month, 10);
    var d = new Date(year, month, 0);
    return d.getDate();
};



/**
 * //获取指定时间段包含的月份
 * @param start_time   2018-01  2018年1月
 * @param end_time     2020-01  2020年1月
 * @returns {Array}
 */

g_tools.all_month = function (start_time, end_time) {
    let all_month = [];

    let start_arr = start_time.split("-");
    let end_arr = end_time.split("-");

    if (start_arr[0] == end_arr[0]) {
        for (let n = start_arr[1]; n <= end_arr[1]; n++) {
            all_month.push(start_arr[0] + "-" + n)
        }
    } else {
        //第一年
        for (let n = start_arr[1]; n <= 12; n++) {
            all_month.push(start_arr[0] + "-" + n)
        }

        if (start_arr[0] + 1 == end_arr[0]) {
            for (let n = 1; n <= end_arr[1]; n++) {
                all_month.push(end_arr[0] + "-" + n)
            }
        } else {
            for (let x = parseInt(start_arr[0]) + 1; x <= parseInt(end_arr[0]) - 1; x++) {
                for (let y = 1; y <= 12; y++) {
                    all_month.push(x + "-" + y)
                }
            }

            //最后一年
            for (let z = 1; z <= end_arr[1]; z++) {
                all_month.push(end_arr[0] + "-" + z)
            }
        }
    }

    return all_month;
}




/**
 * 获取指定月份有几周
 * @param year
 * @param month
 * @returns {number}
 */
let getWeeks = function (year, month) {
    var d = new Date();
    // 该月第一天
    d.setFullYear(year, month - 1, 1);
    var w1 = d.getDay();
    if (w1 == 0) w1 = 7;
    // 该月天数
    d.setFullYear(year, month, 0);
    var dd = d.getDate();
    // 第一个周一
    let d1;
    if (w1 != 1) d1 = 7 - w1 + 2;
    else d1 = 1;
    let week_count = Math.ceil((dd - d1 + 1) / 7);
    return week_count;
}


/**
 * 获取指定时间段的周
 * @param start_time 如:2018-05-4  //2018年5月第四周
 * @param end_time  如:2018-09-3  //2018年9月第三周
 * @returns {Array}
 */

g_tools.all_week = function (start_time, end_time) {
    //////console.log("a")
    let all_week = [];
    let start_arr = start_time.split("-");
    let end_arr = end_time.split("-");

    //获取第一个月有几周
    let num = getWeeks(start_arr[0], start_arr[1]);
    //////console.log(num)
    for (let n = start_arr[2]; n <= num; n++) {
        all_week.push(start_arr[0] + "-" + start_arr[1] + "-" + n);
    }
    //////console.log(all_week)
    start_arr = (Moment(start_arr[0] + "-" + start_arr[1]).add(1, 'month').format("YYYY-MM")).split("-");
    let start = start_arr[0] + "-" + start_arr[1];
    end_arr = (Moment(end_arr[0] + "-" + end_arr[1]).add(-1, 'month').format("YYYY-MM")).split("-");
    let end = end_arr[0] + "-" + end_arr[1];
    //////console.log(start)
    //////console.log(end)
    //////console.log(Moment(end).isBefore(Moment(start)))
    while (true) {
        if (Moment(end).isBefore(Moment(start))) {
            break;
        } else {
            start_arr = start.split("-");
            num = getWeeks(start_arr[0], start_arr[1]);
            for (let i = 1; i <= num; i++) {
                all_week.push(start_arr[0] + "-" + start_arr[1] + "-" + i);
            }
            start = Moment(start).add(1, 'month').format("YYYY-MM");

            //最后一个月

            end_arr = end_time.split("-");

            for (let m = 1; m <= end_arr[2]; m++) {
                all_week.push(end_arr[0] + "-" + end_arr[1] + "-" + m);
            }
        }
    }


    return all_week;
}




/**
 * //判斷是否為非工作日
 * @param no_work
 * @param time
 * @returns {boolean}
 */
let judge_workday = function (no_work, time) {

    //放之前判斷是否為工作日
    let workday_flag = true; //true為工作日

    for (let d of no_work) {
        if (Moment(time).isoWeekday() == d) {
            workday_flag = false;
        }
    }
    return workday_flag;
};

/**
 *获取指定时间段的所有工作日日期
 * @param start_time
 * @param end_time
 * @param day
 * @param no_work
 * @returns {Array}
 */

g_tools.work_date = function (start_time, end_time, day, no_work) {

    let all_date = []

    if (judge_workday(no_work, start_time)) {
        all_date.push(start_time);
    }

    while (true) {
        if (Moment(end_time).isBefore(Moment(start_time).add(day, 'days'))) {
            break;
        } else {
            start_time = Moment(start_time).add(day, 'days');
            if (judge_workday(no_work, start_time)) {
                all_date.push(start_time.format("YYYY-MM-DD"))
            }

        }
    }

    return all_date;
}


// //////console.log(work_date("2018-06-28","2018-07-12",1,[6,7]))


/**
 * 获取指定时间段的所有日期
 * @param start_time
 * @param end_time
 * @param day
 * @returns {Array}
 */
g_tools.all_date = function (start_time, end_time, day) {
    let all_date = [];
    all_date.push(start_time);

    while (true) {
        if (Moment(end_time).isBefore(Moment(start_time).add(day, 'days'))) {
            break;
        } else {
            start_time = Moment(start_time).add(day, 'days');
            all_date.push(start_time.format("YYYY-MM-DD"))
        }
    }

    return all_date;
}




//去除指定时间段的非工作日
/**
 *
 * @param start    开始时间
 * @param end      结束时间
 * @param rest_day 休息第一天是周几？ 例如:周六开始休息就传6
 * @param rest_count  一周休息的天数  例如:周六开始休息就传2
 * @returns {number}    返回指定时间段工作日的天数
 *
 */

g_tools.count_work_day = function (start, end, rest_day, rest_count) {

    let sum1 = Moment(time1).dayOfYear();
    let sum2 = Moment(time2).dayOfYear();
    let sum = sum2 - sum1 + 1; //这段时间总共的天数

    let num = 0; //统计这段时间总共的休息日
    let count1 = Moment(start).week();
    let count2 = Moment(end).week();

    num += ((count2 - count1) - 1) * rest_count;

    if (Moment(start).weekday() <= rest_day) {
        num += rest_count;
    } else if (rest_day + rest_count - 1 >= Moment(start).weekday()) {
        num += (rest_day + rest_count) - Moment(start).weekday();
    };

    if (Moment(end).weekday() >= rest_day) {
        num += Moment(end).weekday() - rest_day + 1;
    }

    return sum - num;
};



g_tools.getWeekTime = function (year, month, weekday) {

    var d = new Date();
    // 该月第一天
    d.setFullYear(year, month - 1, 1);
    var w1 = d.getDay();
    if (w1 == 0) w1 = 7;
    // 该月天数
    d.setFullYear(year, month, 0);
    var dd = d.getDate();
    // 第一个周一
    let d1;
    if (w1 != 1) d1 = 7 - w1 + 2;
    else d1 = 1;
    var monday = d1 + (weekday - 1) * 7;
    var sunday = monday + 6;
    var from = year + "-" + month + "-" + monday;
    var to;
    if (sunday <= dd) {
        to = year + "-" + month + "-" + sunday;
    } else {
        d.setFullYear(year, month - 1, sunday);
        let days = d.getDate();
        to = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + days;
    }
    return {
        start_time: new Date(from),
        end_time: new Date(to)
    }

}


g_tools.getMonthTime = function (date) {

    let from = new Date(Moment(date).startOf('month'));
    let to = new Date(Moment(date).endOf('month'));
    return {
        start_time: from,
        end_time: to
    }
}




//删除数组中的空元素
//g_tools.DeleteEInArr= function (arr) {
//    //////////console.log(arr);
//    //////////console.log(arr.length);
//    for(let i=0;i<arr.length;i++){
//        if(!arr[i]||!arr[i].replace(/\s+/g,"")){
//            //////////console.log("dddd")
//            //删除i下标的对象
//            //////////console.log(arr.length)
//            arr.splice(i,1); //删除下标为i的元素
//            //////////console.log(arr.length)
//        }
//    }
//    return arr;
//    //////////console.log("re");
//    //////////console.log(arr);
//};



//返回对象数组中arr_field=value的对象
g_tools.ArrReturnObject = function (arr, value, arr_field) {
    ////////////console.log(arr);
    ////////////console.log(value)
    ////////////console.log(arr_field)
    let back_info = {}
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].props[arr_field] == value) {
            back_info = arr[i]
        }
    }
    return back_info;
};



//删除arr数组中 arr_field字段值$in value(值的数组)的对象,并返回删除的对象

g_tools.DeleteEleInArrAndReturn = function (arr, value, arr_field) {
    let back_info = {}
    back_info.deleteObj = [];
    for (let i = 0; i < arr.length; i++) {
        for (let v of value) {
            if (arr[i]) {

                if (arr[i].props[arr_field] == v) {
                    //存放要删除的对象
                    back_info.deleteObj.push(arr[i]);
                    arr.splice(i, 1); //删除下标为i的元素
                    i--; //0减后变为-1 但js不报错
                }
            } else {
                break;
            }
        }

    }
    back_info.newArr = arr;
    return back_info;
};



//根据字段删除数组中的对象
g_tools.DelEleInArr = function (arr, e, arr_field) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]) {
            if (arr[i][arr_field] == e) {
                //删除i下标的对象
                arr.splice(i, 1); //删除下标为i的元素
                i--;
            }
        }
    }
    return arr;
};



//根据字段删除数组中的对象[//审批、日志]
g_tools.DeleteEleInArr = function (arr, e, arr_field) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]) {
            if (arr[i].props[arr_field] == e) {
                //删除i下标的对象
                arr.splice(i, 1); //删除下标为i的元素
                i--;
            }
        }
    }
    return arr;
};

/**
 判断输入框中输入的日期格式为yyyymmdd和正确的日期
 */
g_tools.IsDate = function (mystring) {
    ////////////console.log(mystring);
    var reg = /^(\d{4})(\d{2})(\d{2})$/;
    var str = mystring;
    // //////////console.log(reg.test(str)&&RegExp.$2<=12&&RegExp.$3<=31);
    if (reg.test(str) && RegExp.$2 <= 12 && RegExp.$3 <= 31) {
        return true;
    }
    return false;
}
/***
 * 删除数组中的指定元素
 */

g_tools.ArrRemoveByValue = function (arr, val) {
    // console.log("删除数组中的指定元素")
    // console.log(arr)
    // console.log(val)
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}





/***
 * 返回arr中从下标index开始，count元素的数组
 */

g_tools.GetArrELE = function (arr, index, count) {
    let back = [];
    let c = 0;
    for (let i = index; i < arr.length; i++) {
        if (c < count) {
            back.push(arr[i])
            c++;
        }
    }
    return back;
};


g_tools.ArrContains = function (arr, obj) {
    if (arr) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
    }
    return false;
};


//正则匹配
g_tools.RegularExpressioMatch = function (regu, s) {
    ////////////console.log(regu);
    var re = new RegExp(regu);
    if (re.test(s)) {
        return true;
    } else {
        return false;
    }
};



//json对象数组按对象属性排序
g_tools.ArrSortByJsonAattribute = function (arr, attribute) {
    function sortAttribute(a, b) {
        return a[attribute] - b[attribute]
    }
    let result = arr.sort(sortAttribute);
    return result;
};

//判断数组中所有的元素是否有包含指定字符串
g_tools.ArrIsContainStr = function (arr, str) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].indexOf(str) > -1) {
            return true;
        }
    }
    return false;
};

//数组中的元素去重
g_tools.ArrDuplicateRemoval = function (arr) {
    let set_arr = new Set(arr);
    arr = Array.from(set_arr) // 再把set转变成array
    return arr;
};
//判断对象中是否有指定key
g_tools.KeyInObj = function (obj, key) {
    let result = obj.hasOwnProperty(key);
    return result;
};

//获取数组中指定元素的下标
g_tools.ValuesInArrIndex = function (arr, v) {
    let index = -1; //数组中没有该元素
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == v) {
            index = i;
            break;
        }
    }
    return index;
};

g_tools.GetMD5 = function (str) {
    let md5 = Crypto.createHash("md5");
    md5.update(str);
    return md5.digest("hex");
};


//去所有空格  [只有字符串类型才可以]
g_tools.TrimAll = function (value) {
    let str = value + "";
    return str.replace(/\s+/g, "");
};

g_tools.GetMD5 = function (str) {
    let md5 = Crypto.createHash("md5");
    md5.update(str);
    return md5.digest("hex");
};

/**
 * 對象深拷貝
 * @param {Number} len
 * @returns {string}
 */
g_tools.ObjectDeepCopy = function deepCopy(obj) {
    let newObj = new Object();
    for (let k in obj) {
        newObj[k] = obj[k];
    }
    return newObj;
};



/**
 * 生成随机的字符串，长度为10
 * @param {Number} len
 * @returns {string}
 */
let CreateRandomString = function (len) {
    const CHARS = '0123456789ABCDEFGHIJKLMfiNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    const STRING_LENGTH = len;
    let random_str = '';
    for (var i = 0; i < STRING_LENGTH; i++) {
        let r_num = Math.floor(Math.random() * CHARS.length);
        random_str += CHARS.substring(r_num, r_num + 1);
    }
    return random_str;
};
/*
 * 判断来的数据是否为空{}
 * */
g_tools.isEmptyObject = function (obj) {

    for (let x in obj) {
        //////////console.log(x)
        return true;
    }
    return false;
};
/**
 * 生成人员昵称
 * @returns {string}
 * @constructor
 */
g_tools.GeneratePersonNickName = function () {
    return CreateRandomString(8);
};

/**
 * 生成Session 随机字符串
 * @returns {string}
 * @constructor
 */
g_tools.GenerateSessionRandomString = function () {
    return CreateRandomString(10);
};
/**
 * 获取某个对象的Key，以数组的形式返回
 * @param obj
 * @returns {Array}
 * @constructor
 */
g_tools.GetValueArrayOfObject = function (obj) {
    let arr = [];
    for (let key in obj) {
        arr.push(obj[key])
    }
    return arr;
};
/**
 * 获取Schema 的 remark type
 * @param type
 * @returns {Array}
 * @constructor
 */
g_tools.GetSchemaRemarkTypeKey = function (type) {
    let schema_remark_type = Common_Consts.SCHEMA_REMARK_TYPE[type];
    return g_tools.GetValueArrayOfObject(schema_remark_type);
};
/**
 * 获取Schema 的 remark type
 * @returns {Array}
 * @constructor
 */
g_tools.GetSchemaErrorRemarkTypeKey = function () {
    return g_tools.GetSchemaRemarkTypeKey("ERROR")
};
/**
 * 生成随机数，长度自定义
 * @param {Number} num
 * @returns {string}
 * @constructor
 */
let GenerateRandomDigit = function (num) {
    let str = "";
    for (let i = 0; i < num; i++) {
        str += Math.floor(Math.random() * 10).toString();
    }
    return str;
};
/**
 * 生成短信验证码
 * @returns {string}
 * @constructor
 */
g_tools.GetSmsAuthCode = function () {
    return GenerateRandomDigit(4);
};
/**
 * 生成角色编号
 * @returns {string}
 * @constructor
 */
g_tools.GetRoleNoCode = function () {
    return GenerateRandomDigit(6);
};
/**
 * 检查是否是正确手机号
 * @param {String} cellphone
 * @returns {boolean}
 * @constructor
 */
g_tools.IsTrueCellphone = function (cellphone) {
    const pattern = /^1[3456789]\d{9}$/;
    return pattern.test(cellphone);
};
/**
 * 生成 MD5 密文
 * @param str
 * @returns {*}
 * @constructor
 */
g_tools.GetMD5 = function (str) {
    let md5 = Crypto.createHash("md5");
    md5.update(str);
    return md5.digest("hex");
};
/**
 * 生成默认密码
 * @returns {*}
 * @constructor
 */
g_tools.GenerateDefaultPassword = function () {
    const pwd = "123456";
    return ctx.GetMD5(pwd);
};
/**
 * 克隆对象
 * @param obj
 * @returns {Object}
 * @constructor
 */
g_tools.ObjectClone = function (obj) {
    let obj_str = JSON.stringify(obj);
    return JSON.parse(obj_str);
};

/**
 * aes加密
 * @param data 待加密内容
 * @param key 必须为32位私钥
 * @returns {string}
 */
g_tools.Encryption = function (data, key, iv) {
    key = key || CreateRandomString(32);
    //////////console.log("key:", key);
    iv = iv || "";
    let clear_encoding = 'utf8';
    let cipher_encoding = 'base64';
    let cipher_chunks = [];
    let cipher = Crypto.createCipheriv('aes-256-ecb', key, iv);
    cipher.setAutoPadding(true);
    cipher_chunks.push(cipher.update(data, clear_encoding, cipher_encoding));
    cipher_chunks.push(cipher.final(cipher_encoding));
    return cipher_chunks.join('');
};

/**
 * aes解密
 * @param data 待解密内容
 * @param key 必须为32位私钥
 * @returns {string}
 */
g_tools.Decryption = function (data, key, iv) {
    if (!data) {
        return "";
    }
    iv = iv || "";
    let clear_encoding = 'utf8';
    let cipher_encoding = 'base64';
    let cipher_chunks = [];
    let decipher = Crypto.createDecipheriv('aes-256-ecb', key, iv);
    decipher.setAutoPadding(true);
    cipher_chunks.push(decipher.update(data, cipher_encoding, clear_encoding));
    cipher_chunks.push(decipher.final(clear_encoding));
    return cipher_chunks.join('');
};
/**
 * 获取接口错误返回信息
 * @param CODE
 * @param MESSAGE
 * @returns {{RES: string, ERROR_MSG: {CODE: *, MESSAGE: *}}}
 * @constructor
 */
g_tools.GetRESTFulAPIErrorMsgBack = function (CODE, MESSAGE) {
    return {
        RES: "FAILED",
        ERROR_MSG: {
            CODE: CODE,
            MESSAGE: MESSAGE
        }
    }
};

/**
 * 上传图片接口正确返回信息
 * @param ALL_SUM
 * @param DATA
 * @returns {{RES: string, ALL_SUM: *, DATA: *}}
 * @constructor
 */
g_tools.FileGetRESTFulAPICorrectMsgBack = function (data) {
    let return_obj = {
        code: 0,
        data: data
    }
    return return_obj;
};
/**
 * 获取接口正确返回信息
 * @param ALL_SUM
 * @param DATA
 * @returns {{RES: string, ALL_SUM: *, DATA: *}}
 * @constructor
 */
g_tools.GetRESTFulAPICorrectMsgBack = function (ALL_SUM, DATA, EXTEND) {
    let return_obj = {
        RES: "SUCCESS",
        ALL_SUM: ALL_SUM,
        DATA: DATA
    }
    if (EXTEND) {
        return_obj.EXTEND = EXTEND;
    }
    return return_obj;
};
/**
 * 获取系统错误返回信息--创建
 * @returns {{RES: string, ERROR_MSG: {CODE: number, MESSAGE: string}}}
 * @constructor
 */
g_tools.GetRESTFFulAPISystemCreateErrorMsgBack = function () {
    return {
        RES: "FAILED",
        ERROR_MSG: {
            CODE: System_Error_Code.SYSTEM.CREATE.CODE,
            MESSAGE: System_Error_Code.SYSTEM.CREATE.MESSAGE
        }
    }
};
/**
 * 获取系统错误返回信息--获取
 * @returns {{RES: string, ERROR_MSG: {CODE: number, MESSAGE: string}}}
 * @constructor
 */
g_tools.GetRESTFFulAPISystemGetErrorMsgBack = function () {
    return {
        RES: "FAILED",
        ERROR_MSG: {
            CODE: System_Error_Code.SYSTEM.GET.CODE,
            MESSAGE: System_Error_Code.SYSTEM.GET.MESSAGE
        }
    }
};
/**
 * 获取系统错误返回信息--更新
 * @returns {{RES: string, ERROR_MSG: {CODE: number, MESSAGE: string}}}
 * @constructor
 */
g_tools.GetRESTFFulAPISystemUpdateErrorMsgBack = function () {
    return {
        RES: "FAILED",
        ERROR_MSG: {
            CODE: System_Error_Code.SYSTEM.UPDATE.CODE,
            MESSAGE: System_Error_Code.SYSTEM.UPDATE.MESSAGE
        }
    }
};
/**
 * 时间格式化
 * @param time
 * @returns {*}
 * @constructor
 */
g_tools.FormatTimeYYYYMMDD = function (time) {
    return Moment(time).format("YYYY-MM-DD");
};
g_tools.FormatTimeYYYYMMDDhhmmss = function (time) {
    return Moment(time).format("YYYY-MM-DD hh:mm:ss");
};
/*
 * 数组去重
 * */
g_tools.removeArrSame = function (arr) {
    var res = [];
    var json = {};
    for (var i = 0; i < arr.length; i++) {
        if (!json[arr[i]]) {
            res.push(arr[i]);
            json[arr[i]] = 1;
        }
    }
    return res;
};
/**
 * 字符串去空格
 * @param str
 * @returns {void|XML|string|*}
 */
g_tools.Tram = function (str) {
    return str.replace(/\s+/g, "");
};


/**
 * 字符串删除左右两端的空格
 * @param str
 * @returns {void|XML|string|*}
 */
g_tools.Trim = function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
};
/**
 * 对象之间的深度合并，将A合并到B
 * @param {Object} a_obj
 * @param {Object} b_obj
 * @returns {*}
 * @constructor
 */
g_tools.ObjectDeepMerge = function (a_obj, b_obj) {
    if (a_obj instanceof Object) {
        let is_arr = Array.isArray(a_obj);
        if (!is_arr) {
            for (let key in a_obj) {
                if (!b_obj[key]) {
                    b_obj[key] = {};
                }
                if (a_obj[key] instanceof Object) {
                    g_tools.ObjectDeepMerge(a_obj[key], b_obj[key])
                } else {
                    b_obj[key] = a_obj[key];
                }
            }
        }
    } else {
        throw "data is not object type"
    }
    return b_obj;
};
/*
 * 生成单号
 */
g_tools.GenerateOrderId = function () {
    return Moment().format('YYYYMMDDHHmmssSSSS') +
        Math.floor(Math.random() * 10).toString() +
        Math.floor(Math.random() * 10).toString();
};
/**
 *
 *
 *
 * 获取过去一段时间的起始和结束时间
 * @return {object}
 * ex: getLastTime(3, 'day');
 * 获取过去三天的开始和结束时间
 */
g_tools.GetLastTime = function (n, t) {
    t = t || "day";
    t = t.toLowerCase();
    let startDate = t === 'day' ?
        Moment().add(-n, 'day').startOf('day') :
        Moment([Moment().year(), Moment().month()]).add(-n, 'month');
    let endDate = t === 'day' ?
        Moment().add(-1, 'day').endOf('day') :
        Moment().add(-1, "month").endOf("month");
    return {
        start: startDate.toDate(),
        end: endDate.toDate()
    };
};

function GetSomeTime(num, type) {
    let now = Moment();
    let week = now.add(num, type);
    let start = g_tools.ObjectClone(week.startOf(type));
    // //////////console.log("start 1:",start);
    let end = week.endOf(type);
    // //////////console.log("start:",start);
    return {
        start: Moment(start).toDate(),
        end: end.toDate()
    }
}
/*
 * 获取一周内开始时间和结束时间，
 * 从周日 - 周六
 * num 等于0代表本周
 */
g_tools.GetSomeWeekTime = function (num) {
    return GetSomeTime(num, 'week');
};
/*
 * 获取月份时间
 */
g_tools.GetSomeMonthTime = function (num) {
    return GetSomeTime(num, 'month');
};
g_tools.GetTodayStartTime = function () {
    return Moment().startOf('day').toDate();
};
g_tools.GetTodayEndTime = function () {
    return Moment().endOf('day').toDate();
};
g_tools.GetSomeDayStart = function (date) {
    return Moment(date).startOf('day').toDate();
};
g_tools.GetSomeDayEnd = function (date) {
    return Moment(date).endOf('day').toDate();
};

g_tools.InsertEIntoDB = function (e, request) {
    console.log(e)
    if (global.error_log_switch) {
        err_logger.error(e);
        err_logger.error(request);

        Error_Log_Service.InsertErrorLog(e, request)
            .then(function (data) {
                //////////console.log('======================INSERT E INTO DB SUCCESS====================');
            })
            .catch(function (log_err) {
                //////////console.log('======================INSERT E INTO DB FAILED====================');
                //////////console.error(log_err)
            });
    }
};



/**是否是短时间格式字符串1990-12-19*/
g_tools.IsShortDateStr = function (str) {
    return str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
};
/**检查是否是OBJECT_ID*/
g_tools.IsObjectId = function (_id) {
    return Mongoose.Types.ObjectId.isValid(_id);
};
/**
 * 根据两个日期，判断相差天数
 * @param sDate1 开始日期 如：2016-11-01
 * @param sDate2 结束日期 如：2016-11-02
 * @returns {number} 返回相差天数
 */
g_tools.DaysBetween = function (sDate1, sDate2) {
    //Date.parse() 解析一个日期时间字符串，并返回1970/1/1 午夜距离该日期时间的毫秒数
    let time1 = Date.parse(new Date(sDate1));
    let time2 = Date.parse(new Date(sDate2));
    return Math.abs(parseInt((time2 - time1) / 1000 / 3600 / 24));
};

/**
 * 毫秒转化为小时和分钟
 */
g_tools.MillisecondConversion = function (time) {
    let back = "";
    let hour = Math.floor(time / 3600000);
    if (hour > 0) {
        back += hour + "小时"
    }
    time = time % 3600000;
    let minute = Math.floor(time / 60000);
    if (hour > 0 && minute > 0) {
        back += "/" + minute + "分"
    } else if (minute > 0) {
        back += minute + "分"
    }

    return back;
};


/*
 * 校验文件裁剪参数
 * */

g_tools.getCheckCropOptionResult = function (data, key, _path) {
    if (data.cropOption) {
        let mapCropOption = JSON.parse(data.cropOption);
        let nowfileOption = mapCropOption[key] ? mapCropOption[key] : mapCropOption["common"];
        let errStr = '';
        if (g_tools.isEmptyObject(nowfileOption)) {
            if (!nowfileOption.endwidth && !nowfileOption.endheight) {
                errStr = "文件" + key + "图片最终宽高不能同时为空";
                return errStr;
            };
            if (+(nowfileOption.x) < 0 || +(nowfileOption.y) < 0) {
                errStr = "文件" + key + "裁剪起点不能为负数";
                return errStr;
            };
            let x = +Math.floor(nowfileOption.x) || 0;
            let y = +Math.floor(nowfileOption.y) || 0;
            let width = +Math.floor(nowfileOption.width) || 100;
            let height = +Math.floor(nowfileOption.height) || 100;
            // let endwidth = null, endheight = null;
            // cropOption.endwidth ? endwidth = +Math.floor(cropOption.endwidth) : endwidth = null;
            // cropOption.endheight ? endheight = +Math.floor(cropOption.endheight) : endheight =null;
            var dimensions = sizeOf(_path);
            let w = dimensions.width;
            let h = dimensions.height;
            if (x > w || width > w || (x + width) > w) {
                errStr = "文件" + key + "裁剪宽度大于原图宽度";
                return errStr;
            }
            if (y > h || height > h || (y + height) > h) {
                errStr = "文件" + key + "裁剪高度大于原图高度";
                return errStr;
            };
        };
    }
}

//打乱数组顺序
g_tools.Array_Out_Of_Order = function (arr) {
    ////////////console.log(arr);
    arr.sort(function () {
        return 0.5 - Math.random()
    });
    ////////////console.log(arr);
    return arr;
};