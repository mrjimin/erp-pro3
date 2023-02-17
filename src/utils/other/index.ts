import { nextTick } from 'vue';
import router from '@/router/index';
import pinia from '@/stores/index';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '@/stores/themeConfig';
import { Local } from '@/utils/storage';
import { RouteLocationNormalizedLoaded } from 'vue-router';
// import { ElMessage } from 'element-plus';


/**
 * 设置浏览器标题国际化
 * @method const title = useTitle(); ==> title()
 */
export function useTitle() {
    const stores = useThemeConfig(pinia);
    const { themeConfig } = storeToRefs(stores);
    nextTick(() => {
        let webTitle = setTagsViewNameI18n(router.currentRoute.value);
        const globalTitle = themeConfig.value.globalTitle;
        const { path, meta } = router.currentRoute.value;
        if (path === '/login') webTitle = meta.title as string;

        document.title = `${webTitle} - ${globalTitle}` || globalTitle;
    });
}

/**
 * 设置 自定义 tagsView 名称
 * @param params 路由 query、params 中的 tagsViewName
 * @returns 返回当前 tagsViewName 名称
 */
export function setTagsViewNameI18n(item: RouteLocationNormalizedLoaded) {

    const { query, params, meta } = item;
    let tagsViewName = meta.title;  // 非自定义 tagsView 名称
    if (query?.tagsViewName || params?.tagsViewName) {
        // 非国际化
        tagsViewName = (query?.tagsViewName || params?.tagsViewName) as string;
    }
    return tagsViewName;
}

/**
 * 图片懒加载
 * @param el dom 目标元素
 * @param arr 列表数据
 * @description data-xxx 属性用于存储页面或应用程序的私有自定义数据
 */
export const lazyImg = (el: any, arr: any) => {
    const io = new IntersectionObserver((res) => {
        res.forEach((v: any) => {
            if (v.isIntersecting) {
                const { img, key } = v.target.dataset;
                v.target.src = img;
                v.target.onload = () => {
                    io.unobserve(v.target);
                    arr[key]['loading'] = false;
                };
            }
        });
    });
    nextTick(() => {
        document.querySelectorAll(el).forEach((img) => io.observe(img));
    });
};

/**
 * 全局组件大小 "" | "small" | "default" | "large"
 * @returns 返回 `window.localStorage` 中读取的缓存值 `globalComponentSize`
 */
export const globalComponentSize = (): "" | "small" | "default" | "large" => {
    const stores = useThemeConfig(pinia);
    const { themeConfig } = storeToRefs(stores);
    return Local.get('themeConfig')?.globalComponentSize || themeConfig.value?.globalComponentSize;
};

/**
 * 对象深克隆
 * @param obj 源对象
 * @returns 克隆后的对象
 */
export function deepClone<T = any>(obj: T): T {
    let newObj: any;
    try {
        // obj.push
        newObj = Array.isArray(obj) ? [] : {};
    } catch (error) {
        newObj = {};
    }
    for (const attr in obj) {
        if (obj[attr] && typeof obj[attr] === 'object') {
            newObj[attr] = deepClone(obj[attr]);
        } else {
            newObj[attr] = obj[attr];
        }
    }
    return newObj;
}

/**
 * 判断是否是移动端
 */
export function isMobile() {
    if (
        navigator.userAgent.match(
            /('phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone')/i
        )
    ) {
        return true;
    } else {
        return false;
    }
}

/**
 * 判断数组对象中所有属性是否为空，为空则删除当前行对象
 * @description @感谢大黄
 * @param list 数组对象
 * @returns 删除空值后的数组对象
 */
export function handleEmpty(list: any) {
    const arr = [];
    for (const i in list) {
        const d = [];
        for (const j in list[i]) {
            d.push(list[i][j]);
        }
        const len = d.filter((item) => item === '').length;
        if (len !== d.length) {
            arr.push(list[i]);
        }
    }
    return arr;
}

/**
 * 通过name进行路由跳转，并验证是否有该路由的访问权限
 * @param name 路由名称
 * @param data 需要传参的数据，query方式，默认为空对象
 * @param msg 路由不存在时的提示信息
 * @returns 
 */
export function onRouterLink(name: string, data = {}, msg = '无权访问') {
    if (!router.hasRoute(name)) {
        // return ElMessage.error(msg);
    } else {
        router.push({
            name: name,
            query: data,
        });
    }
}
