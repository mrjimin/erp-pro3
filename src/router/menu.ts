import { RouteRecordRaw } from "vue-router";

// vue路由菜单格式
type MenuVueFormat = RouteRecordRaw & {
    id?: number,
    title?: string,
}

// 后端返回的路由转vue路由格式
export function formatRoutes(routerArr: any[]) {
    const arr: MenuVueFormat[] = [];
    let obj: MenuVueFormat
    // = {};
    // let route:RouteRecordRaw={
    //     path
    // }
    routerArr.forEach((router: any) => {
        const tmp = { ...router };
        // if (tmp.type == 1) {  //只筛选出type=1的项
        if (tmp.children?.length > 0) {
            tmp.children = formatRoutes(tmp.children);
            const redirect = tmp.children[0].path;

            // const { url, children, type } = router;
            obj = {
                // path: tmp.url,
                // name: tmp.name,
                "component": tmp.page_path, //视图路径
                "path": tmp.route_path, //路由路径
                "name": tmp.route_name, //路由名称
                "redirect": redirect ? redirect : tmp.redirect, //重定向路径
                "meta": {
                    "id": tmp.id, //菜单ID
                    "pid": tmp.pid, //上级菜单
                    "title": tmp.title, //菜单名称
                    "level": tmp.level, //菜单层级
                    "isLink": tmp.is_link, //是否外链  0不是  1是
                    "linkUrl": tmp.link_url, //外链地址
                    "isHide": tmp.is_hide, //是否隐藏  0不是  1是
                    "isAffix": tmp.is_affix, //是否固定  0不是  1是
                    "isKeepAlive": Number(tmp.is_keep_alive) as 0 | 1, //是否缓存  0不是  1是
                    "isIframe": tmp.is_iframe, //是否内嵌  0不是  1是
                    "icon": tmp.icon, //菜单图标
                    "sort": tmp.sort, //菜单排序 （倒序）
                    "menu_type": tmp.menu_type, //菜单类型 1菜单  2按钮
                    "created_at": tmp.created_at, //创建时间
                    "roles": ['admin'],      //权限
                },
                children: tmp.children
            }
        } else {
            obj = {
                // path: tmp.url,
                // name: tmp.name,
                "component": tmp.page_path, //视图路径
                "path": tmp.route_path, //路由路径
                "name": tmp.route_name, //路由名称
                "redirect": tmp.redirect, //重定向路径
                // meta: { title: tmp.name },
                "meta": {
                    "id": tmp.id, //菜单ID
                    "pid": tmp.pid, //上级菜单
                    "title": tmp.title, //菜单名称
                    "level": tmp.level, //菜单层级
                    "isLink": tmp.is_link, //是否外链  0不是  1是
                    "linkUrl": tmp.link_url, //外链地址
                    "isKeepAlive": Number(tmp.is_keep_alive) as 0 | 1, //是否缓存  0不是  1是
                    "isHide": tmp.is_hide, //是否隐藏  0不是  1是
                    "isAffix": tmp.is_affix, //是否固定  0不是  1是
                    "isIframe": tmp.is_iframe, //是否内嵌  0不是  1是
                    "icon": tmp.icon, //菜单图标
                    "sort": tmp.sort, //菜单排序 （倒序）
                    "menu_type": tmp.menu_type, //菜单类型 1菜单  2按钮
                    "created_at": tmp.created_at, //创建时间
                    "roles": ['admin'],      //权限
                },
                children: []
            }
        }
        arr.push(obj);
        // }
    })
    return arr;
}




// 后端返回的路由转vue路由格式
export function formatLabel(routerArr: any[]) {
    const arr: LabelOption[] = [];
    let obj: any = {};
    routerArr.forEach((router: any) => {
        const tmp = { ...router };

        // if (tmp.type == 1) {  //只筛选出type=1的项
        if (tmp.children) {
            tmp.children = formatLabel(tmp.children);
            // const { url, children, type } = router;
            obj = {
                value: tmp.meta.id,
                label: tmp.meta.title,
                children: tmp.children
            }
        } else {
            obj = {
                value: tmp.meta.id,
                label: tmp.meta.title,
                children: []
            }
        }
        arr.push(obj);
        // }
    })
    return arr;
}


// 路由过滤递归函数(去掉隐藏的路由)
export const filterHideRoutes = (routes: Array<string>) => {
    const arr: any = [];
    routes.filter((item: any) => !item.meta.isHide)
        .map((val: any) => {
            // 这里可以做一些操作
            // val['title'] = val.meta.title;
            // val['id'] = val.meta.id;
            arr.push({ ...val });
            if (val.children) val.children = filterHideRoutes(val.children);
        });
    return arr;
};


// 路由过滤，去掉组件没填的
export const filterMenu = (menuList: any[]) => {
    return menuList.filter((item: any) => {
        // return menuCode.indexOf(item.code) > -1
        return item.component != ''
    }).map((item: { children: any; }) => {
        item = Object.assign({}, item)
        if (item.children) {
            item.children = filterMenu(item.children)
        }
        return item
    })
}