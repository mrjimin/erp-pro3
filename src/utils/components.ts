import { App, defineAsyncComponent } from 'vue';
import * as svg from '@element-plus/icons-vue';


const Page = {
    SvgIcon: defineAsyncComponent(() => import("@/components/icon/SvgIcon.vue")),
    MyBox: defineAsyncComponent(() => import("@/components/MyBox.vue")),
    MyTable: defineAsyncComponent(() => import("@/components/element/MyTable.vue")),
    MyTablePage: defineAsyncComponent(() => import("@/components/element/MyTablePage.vue")),
    MyDialog: defineAsyncComponent(() => import("@/components/element/MyDialog.vue")),
    MyDialogFull: defineAsyncComponent(() => import("@/components/element/MyDialogFull.vue")),
    MyCascader: defineAsyncComponent(() => import("@/components/element/MyCascader.vue")),
    ImgAudit: defineAsyncComponent(() => import("@/components/other/ImgAudit.vue")),
    MyFormTool: defineAsyncComponent(() => import("@/components/element/MyFormTool.vue")),
    MyDialogBox: defineAsyncComponent(() => import("@/components/element/MyDialogBox.vue")),

}

/**
 * 导出全局注册 element plus svg 图标
 * @param app vue 实例
 * @description 使用：https://element-plus.gitee.io/zh-CN/component/icon.html
 */
export function elSvg(app: App) {
    const icons = svg as any;
    for (const i in icons) {
        app.component(`ele-${icons[i].name}`, icons[i]);
    }
}

/**
 * 注册全局组件
 * @param app vue 实例
 */
export const setComponents = (app: App) => {
    elSvg(app);     // 图标组件

    let key: keyof typeof Page
    for (key in Page) {
        if (Object.prototype.hasOwnProperty.call(Page, key)) {      // 过滤掉原型链上的属性
            app.component(key, Page[key]);     //注册全局组件
        }
    }
}
