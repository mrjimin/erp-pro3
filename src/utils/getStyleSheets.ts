import { nextTick } from 'vue';
import * as svg from '@element-plus/icons-vue';

// 获取阿里字体图标
const getAliIconfont = () => {
    return new Promise((resolve, reject) => {
        nextTick(() => {
            const styles: any = document.styleSheets;
            const sheetsList = [];
            const sheetsIconList = [];
            for (let i = 0; i < styles.length; i++) {
                if (styles[i].href && styles[i].href.indexOf('at.alicdn.com') > -1) {
                    sheetsList.push(styles[i]);
                }
            }
            for (let i = 0; i < sheetsList.length; i++) {
                for (let j = 0; j < sheetsList[i].cssRules.length; j++) {
                    if (sheetsList[i].cssRules[j].selectorText && sheetsList[i].cssRules[j].selectorText.indexOf('.icon-') > -1) {
                        sheetsIconList.push(
                            `${sheetsList[i].cssRules[j].selectorText.substring(1, sheetsList[i].cssRules[j].selectorText.length).replace(/\:\:before/gi, '')}`
                        );
                    }
                }
            }
            if (sheetsIconList.length > 0) resolve(sheetsIconList);
            else reject('未获取到值，请刷新重试');
        });
    });
};

// 初始化获取 css 样式，获取 element plus 自带 svg 图标，增加了 ele- 前缀，使用时：ele-Aim
const getElementPlusIconfont = () => {
    return new Promise<string[]>((resolve, reject) => {
        nextTick(() => {
            const icons = svg as any;
            const sheetsIconList = [];
            for (const i in icons) {
                sheetsIconList.push(`ele-${icons[i].name}`);
            }
            if (sheetsIconList.length > 0) resolve(sheetsIconList);
            else reject('未获取到值，请刷新重试');
        });
    });
};

// 初始化获取 css 样式，这里使用 font awesome 的图标
const getAwesomeIconfont = () => {
    return new Promise((resolve, reject) => {
        nextTick(() => {
            const styles: any = document.styleSheets;
            const sheetsList = [];
            const sheetsIconList = [];
            for (let i = 0; i < styles.length; i++) {
                if (styles[i].href && styles[i].href.indexOf('netdna.bootstrapcdn.com') > -1) {
                    sheetsList.push(styles[i]);
                }
            }
            for (let i = 0; i < sheetsList.length; i++) {
                for (let j = 0; j < sheetsList[i].cssRules.length; j++) {
                    if (
                        sheetsList[i].cssRules[j].selectorText &&
                        sheetsList[i].cssRules[j].selectorText.indexOf('.fa-') === 0 &&
                        sheetsList[i].cssRules[j].selectorText.indexOf(',') === -1
                    ) {
                        if (/::before/.test(sheetsList[i].cssRules[j].selectorText)) {
                            sheetsIconList.push(
                                `${sheetsList[i].cssRules[j].selectorText.substring(1, sheetsList[i].cssRules[j].selectorText.length).replace(/\:\:before/gi, '')}`
                            );
                        }
                    }
                }
            }
            if (sheetsIconList.length > 0) resolve(sheetsIconList.reverse());
            else reject('未获取到值，请刷新重试');
        });
    });
};

/**
 * 获取字体图标 `document.styleSheets`
 * @method ali 获取阿里字体图标 `<i class="iconfont 图标类名"></i>`
 * @method ele 获取 element plus 自带图标 `<i class="图标类名"></i>`
 * @method ali 获取 font awesome 的图标 `<i class="fa 图标类名"></i>`
 */
export const initIconfont = {
    // iconfont
    ali: () => {
        return getAliIconfont();
    },
    // element plus
    ele: () => {
        return getElementPlusIconfont();
    },
    // font awesome
    awe: () => {
        return getAwesomeIconfont();
    },
};



/**
 * @function 获取去css图标的class类名
 * @param {string} prefix 区分字体图标的前缀,例如：.icon-
 * @param {string} [fullIcon=''] 是否需要图标的class全名,例如：iconfont
 * @returns {string[]} 
 * @example initIcon(".icon-","iconfont").then((res)=>{//res;})
 */
export const initIcon = (prefix: string, fullIcon = '') => {
    return new Promise<string[]>((resolve, reject) => {
        const regX = /\:before/;   //用于正则匹配有伪类:before的class名
        const styles = document.styleSheets;

        let sheetsIconList = [];
        for (let i = 0; i < styles.length; i++) {
            for (let j = 0; j < styles[i].cssRules.length; j++) {
                const cssStyleRule = styles[i].cssRules[j] as CSSStyleRule;
                const cText = cssStyleRule.selectorText
                // 判断是对应前缀开头、是否有::before伪类
                if (
                    cText &&
                    cText.indexOf(prefix) === 0 &&
                    regX.test(cText)
                ) {
                    // 清空前面的.和后面的::before,例如.el-icon-info::before=>el-icon-info
                    // /\./gi  替换.为空。/\:\:before/gi  将::before去除。
                    // /\[data-v-(.+?)\]/gi 
                    let className = cText.replace(/\./gi, "").replace(/\:\:before/gi, "")

                    // 可能有fa-close,fa-close-o的这种情况
                    if (cText.indexOf(",") > 0) {
                        const m = className.split(",");
                        let m2 = [];
                        if (fullIcon) {
                            for (let a = 0; a < m.length; a++) {
                                m2.push(fullIcon + ' ' + m[a].replace('.', "").trim())
                            }
                        } else {
                            m2 = m;
                        }
                        sheetsIconList.push(...m2);
                    } else {
                        if (fullIcon) {
                            className = fullIcon + ' ' + className
                        }
                        sheetsIconList.push(className);
                    }
                }
            }
        }
        if (sheetsIconList.length > 0) {
            // 得到数组后，先去重一下在将数组返回出去,避免有重复的class
            sheetsIconList = [...new Set(sheetsIconList)]
            // resolve(sheetsIconList);
        } else {
            console.warn("%c" + prefix + "未获取到值", "color:red");
            // resolve([]);
            // reject(prefix + "未获取到值，请刷新重试");
        }
        resolve(sheetsIconList);
    });
}

