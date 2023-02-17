

/**
 * 客户、供应商去除资金来往大类别 
 * @param row 数组对象
 * @param text 需要返回文字的字段
 * @returns 
 */
export function filterCustomVendor<T extends object, K extends keyof T>(row: T[], text: 'custom' | 'vendor'): T[] {
    const id = 'id' as K
    let aid = 201;
    if (text == 'custom') aid = 301
    // @ts-expect-error aid为正确的值
    const arr = row.filter(item => item[id] !== aid);
    return arr;
}

/**
 * 设置商品名称 
 * @param item goods_name:商品名，goods_code:商品型号，goods_spec:商品规格，title：标题,goods_brand:品牌
 * @returns 
 * @example 
    setGoodsName({
        goods_name: '商品',
        goods_code: 'HV-1000s',
        goods_spec: '编码器测量',
        title: '商品商品商品商品商品',
        goods_brand: '百度',
    })
 */
export function setGoodsName(item: {
    goods_name: string;
    goods_code: string;
    goods_spec: string;
    title: string;
    goods_brand: string;
}, noJoin = false) {
    if (noJoin) return item.goods_name;
    // '【' + item.goods_brand + '】'
    const textArr = [item.goods_brand, item.goods_name];
    if (item.goods_code) textArr.push(item.goods_code);
    if (item.goods_spec) textArr.push(item.goods_spec);
    if (item.title) textArr.push(item.title);
    return textArr.join(" ")
}
