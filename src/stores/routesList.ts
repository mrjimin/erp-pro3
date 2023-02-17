import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';

/**
 * 路由列表
 * @methods setRoutesList 设置路由数据
 * @methods setColumnsMenuHover 设置分栏布局菜单鼠标移入 boolean
 * @methods setColumnsNavHover 设置分栏布局最左侧导航鼠标移入 boolean
 */
export const useRoutesList = defineStore('routesList', {
    state: () => ({
        routesList: [] as RouteRecordRaw[],
        isColumnsMenuHover: false,
        isColumnsNavHover: false,
    }),
    actions: {
        async setRoutesList(data: Array<any>) {
            this.routesList = data;
        },
        async setColumnsMenuHover(bool: boolean) {
            this.isColumnsMenuHover = bool;
        },
        async setColumnsNavHover(bool: boolean) {
            this.isColumnsNavHover = bool;
        },
    },
});

/**
 * 后端返回原始路由(未处理时)
 * @methods setCacheKeepAlive 设置接口原始路由数据
 */
export const useRequestOldRoutes = defineStore('requestOldRoutes', {
    state: () => ({
        requestOldRoutes: [] as RouteRecordRaw[],
    }),
    actions: {
        async setRequestOldRoutes(routes: Array<any>) {
            this.requestOldRoutes = routes;
        },
    },
});

