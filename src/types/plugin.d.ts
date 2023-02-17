import '@vue/runtime-core'
import type { RouteMeta } from 'vue-router';
import * as axios from 'axios'




/**
 * 全局组件扩展
 */
declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        SvgIcon: typeof import('@/components/icon/SvgIcon.vue')['default']
        MyBox: typeof import('@/components/MyBox.vue')['default']
        MyTable: typeof import('@/components/element/MyTable.vue')['default']
        MyTablePage: typeof import('@/components/element/MyTablePage.vue')['default']
        MyFormTool: typeof import('@/components/element/MyFormTool.vue')['default']
        MyDialog: typeof import('@/components/element/MyDialog.vue')['default']
        MyDialogFull: typeof import('@/components/element/MyDialogFull.vue')['default']
        MyDialogBox: typeof import('@/components/element/MyDialogBox.vue')['default']
        MyCascader: typeof import('@/components/element/MyCascader.vue')['default']
        ImgAudit: typeof import('@/components/other/ImgAudit.vue')['default']
    }

}


/**
 * 扩展路由meta对象参数说明
 */
declare module 'vue-router' {
    interface RouteMeta {
        id: number,        // id，唯一标识，面包屑导航使用
        title: string,      // 菜单栏及 tagsView 栏、菜单搜索名称（国际化） 
        isLink: boolean,      // 是否使用外链
        linkUrl: string,    // 外链地址
        isHide?: boolean,      //是否隐藏此路由 false
        isKeepAlive: 0 | 1 | boolean,   // 是否缓存组件状态         true
        isAffix: boolean,    // 是否固定在 tagsView 栏上
        isIframe: boolean,     // 是否内嵌窗口，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
        roles: string[],        // 当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common  ['admin', 'common']
        icon: string,       // 菜单、tagsView 图标，阿里：加 `iconfont xxx`，font awesome：加 `fa xxx` iconfont icon-home
    }
}


/**
 * 扩展axios配置参数
 */
declare module 'axios' {
    interface AxiosRequestConfig {
        /**
         * 请求超时再次发起请求处理,retry:请求次数，retryDelay:请求的间隙
         */
        retry?: number,
        retryDelay?: number
    }
    // interface AxiosResponse<T = any> {
    //     code: number;
    //     data: T;
    //     msg: string;
    //     // type?: string;
    //     [key: string]: T;
    // }
}


