
// async / await 方法调用定时器
export const wait = (ms: number) => {
    return new Promise<number>((resolve, reject) => {
        setTimeout(() => {
            resolve(ms)
        }, ms)
    })
}

// async / await 错误处理方法
export async function awaitWrap<T, U = any>(promise: Promise<T>): Promise<[U | null, T | null]> {
    try {
        const data = await promise
        const result: [null, T] = [null, data]
        return result
    } catch (err) {
        const result_1: [U, null] = [err as U, null]
        return result_1
    }
}




/**
 * 根据数据对象里的某个值取得另一个字段的值
 * @param val 值
 * @param row 数组对象
 * @param id 参数val对应的键值
 * @param text 需要返回文字的字段
 * @returns 
 */
// export const getTextName = <T = any>(val: T[keyof T], row: T[], id: keyof T, text: keyof T) => {
export function getTextName<T extends object, K extends keyof T, Y extends keyof T>(val: T[keyof T], row: T[], id: K, text: Y) {
    const node = row.find(item => item[id] == val)
    return node ? node[text] : '';
}

/**
 * 重写Number.toFixed()方法，采用四舍五入方式保留小数位数
 * @param value {number} 需要保留小数为的数值，默认是0
 * @param fractionDigits 小数点后的位数(正整数)。必须介于0到20之间（包括0和20）。
 */
export const myFixed = (value: number | string, fractionDigits = 0): string => {
    // 判断传入的是否为数字
    const num = Number.isNaN(value) ? 0 : Number(value)
    // 判断保留小数为的值是否为整数
    const sca = Number.isInteger(fractionDigits) ? fractionDigits : 0;
    const len = 10 ** sca
    return (Math.round(num * len) / len).toFixed(sca);
}

/**
 * 小数格式化
 * @param value 需要格式化的值,默认为0
 * @param scale 保留小数点的位数,默认保留2位小数
 * @returns 
 */
export const NumberFormat = (value: any = 0, scale = 2) => {
    const num = Number(value);
    // 判断scale是否为整数
    const sca = Number.isInteger(scale) ? scale : 0;
    const len = sca && sca > 0 ? 10 ** sca : 1
    return Number.isNaN(num) ? '-' : (Math.round(num * len) / len).toFixed(sca);
    // return Number.isNaN(num) ? '-' : num.toFixed(scale);
};

/**
 * 比较两个值是否相等
 * @param val1 需要比较的值
 * @param val2 需要比较的值
 * @param scale 保留小数点的位数,默认保留2位小数
 * @returns 
 */
export const VerifyNumber = (val1: number, val2: number, scale = 2): boolean => {
    const num = Number(val1);
    const num2 = Number(val2);
    return Number(num.toFixed(scale)) === Number(num2.toFixed(scale))
};

/**
 * 获取单据前缀
 * @param str 单号
 * @returns 
 */
export const getBillPrefix = (str: string) => {
    const reg = /^[a-zA-Z]*/;   // 字母开头取多未
    const obj = reg.exec(str)

    return obj?.[0] || ''
}
