import md5 from 'md5';
import { encode } from 'js-base64';

// 对象数组排序，并用&拼接
export function raw(args: { [x: string]: any; }) {
    let keys = Object.keys(args);
    keys = keys.sort()
    const newArgs: any = {};
    keys.forEach(function (key) {
        newArgs[key] = args[key];
        // newArgs[key.toLowerCase()] = args[key];
    });

    let string = '';
    for (const k in newArgs) {
        //console.log(newArgs[k] instanceof Object);
        let val = newArgs[k];
        if (newArgs[k] instanceof Object) {
            val = JSON.stringify(newArgs[k])
        }
        string += k + '=' + val + '&';
    }

    // string = string.substring(1)

    return string;
}

// 接口加密
export function crypto<T>(obj: T & { sign?: string; time?: number; }) {

    // 密钥
    // let keys = "58402683605729e494da882524d1fe12";
    const keys = import.meta.env.VITE_SIGN_KEY;
    if (!keys) return false;

    // 原有data已经存在sign，time这两个字段时，删除这两个字段后在加密
    if (obj.sign) delete obj.sign;
    if (obj.time) delete obj.time;

    const time = ~~(new Date().getTime() / 1000);    //取得时间戳，并转成10位

    const newData = { ...obj, time }

    const str = raw(newData);     //按键值排序，并用&符号连接

    const baseStr = encode(str);      //base64加密
    const newStr = keys + baseStr + keys;
    const sign = md5(newStr)  //md5加密

    return { ...newData, sign }
}
