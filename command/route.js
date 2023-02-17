// 导入fs模块
const fs = require('fs')
// const { dynamicRoutes } = require('./src/router/route.ts')
// console.log('dynamicRoutes :>> ', dynamicRoutes);


/**
 * 树形json数据数组转平级普通数组
 * @param classifyList 嵌套数组
 * @param id 关联的键值，默认id
 * @param key 上级所属的键值，默认pid
 * @param children 嵌套数组的子类，子类的键值，默认children
 * @returns any[]
*/
function transformLevelArr(classifyList, id = "id", key = "pid", children = 'children') {
    const temp = [];
    const forFn = function (arr, val = 0) {
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            if (val) item[key] = val;
            temp.push(item)

            if (item[children]) forFn(item[children], item[id]);
        }
    };
    forFn(classifyList);
    return temp;
}

let readUrl = './src/router/route.ts';
let writeUrl = './src/router/layout.ts'

fs.readFile(readUrl, "utf8", function (err, data) {
    // 如果读取成功，则err的值为null，dataStr会显示例1.txt的文本内容
    // 如果读取失败，err的值为错误对象，展示出错误信息，data的值为undefined
    // console.log(err)
    // console.log("------")
    // console.log(data)
    if (data) {
        let arr = data.split("//// ****");
        // console.log('arr :>> ', arr);
        // console.log('arr[1] :>> ', arr[1].replaceAll("() => import", ''));
        let str = arr[1] || '';
        if (!str) return console.log("未查找到‘//// ****’包括的内容")
        let reg = /.*\=/;
        // let regex = /(\[)[\s\S]*(\])/;      // 匹配[]的内容
        // console.log('str.match(regex) :>> ', str.match(regex));
        let str2 = str.replace(reg, '');
        str2 = str2.replaceAll('() => import', '')
        // console.log('str2 :>> ', str2);
        // // console.log('Array.from(str2) :>> ', Array.from(str2));
        // console.log('eval(str2) :>> ', eval(str2));
        let treeArr = eval(str2);
        let treeArrChild = treeArr[0].children
        let routeList = transformLevelArr(treeArrChild)
        // console.log('res :>> ', routeList);
        const layouts = routeList.map((item, index) => {
            // console.log('item :>> ', item.component);
            if (!item.component) return
            const res = item.component
            // console.log(res)
            if (res.indexOf('layout/routerView') < 0) {
                var urlReg = /(?<=\/views\/).+(?=\.vue)/g;
                let option = {}
                let txt = res.match(urlReg)
                if (txt) {
                    option.value = txt[0]
                    option.name = item.name;
                    option.title = item.meta.title
                    option.component = item.component;
                }
                return option
            }
        })
        // console.log('layouts :>> ', layouts);
        // 过滤 undefined 的数据
        const layout = layouts.filter(Boolean)
        // console.log(layout);
        const main = [
            {
                title: '主结构',
                name: 'layout',
                value: 'layout/routerView/parent',
                component: '@/layout/routerView/parent.vue',
            },
            ...layout
        ]
        let content = `export const MainPage = ` + JSON.stringify(main)
        // console.log('content :>> ', content);
        // 调用fs.writeFile()方法
        fs.writeFile(writeUrl, content, function (err) {
            // 如果err为true，则文件写入失败，并返回失败信息
            if (err) {
                return console.log('文件写入失败！' + err.message)
            }
            // 若文件写入成功，将显示“文件写入成功”
            console.log('文件写入成功！')
        })
    }

})
