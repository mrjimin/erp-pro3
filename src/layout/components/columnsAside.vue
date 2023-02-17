<template>
    <div class="layout-columns-aside">
        <el-scrollbar>
            <ul @mouseleave="onColumnsAsideMenuMouseleave()">
                <li v-for="(v, k) in columnsAsideList" :key="k"
                    :ref="(el) => { if (el) columnsAsideOffsetTopRefs[k] = el }"
                    :class="{ 'layout-columns-active': liIndex === k, 'layout-columns-hover': liHoverIndex === k }"
                    :title="v.meta?.title" @click="onColumnsAsideMenuClick(v, k)"
                    @mouseenter="onColumnsAsideMenuMouseenter(v, k)">
                    <div v-if="!v.meta?.isLink || (v.meta.isLink && v.meta.isIframe)"
                        :class="themeConfig.columnsAsideLayout">
                        <SvgIcon :name="(v.meta?.icon as string)" />
                        <div class="columns-vertical-title font12">
                            {{ setMenuTitle(v.meta?.title as string) }}
                        </div>
                    </div>
                    <!-- 外链跳转 -->
                    <div v-else :class="themeConfig.columnsAsideLayout">
                        <a :href="v.meta.linkUrl" target="_blank">
                            <SvgIcon :name="v.meta.icon" />
                            <div class="columns-vertical-title font12">
                                {{ setMenuTitle(v.meta.title) }}
                            </div>
                        </a>
                    </div>
                </li>
                <li ref="columnsAsideActiveRef" :class="themeConfig.columnsAsideStyle"></li>
            </ul>
        </el-scrollbar>
    </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted, nextTick, watch } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate, RouteRecordRaw, RouteLocation } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useRoutesList } from '@/stores/routesList';
import { useThemeConfig } from '@/stores/themeConfig';
import { getParentId } from '@/utils/common/tree';
import { useEventBus } from '@vueuse/core';
import { wait } from '@/utils/common';

// 定义接口来定义对象的类型
interface ColumnsAsideState {
    columnsAsideList: RouteRecordRaw[];
    liIndex: number;
    liOldIndex: null | number;
    liHoverIndex: null | number;
    liOldPath: null | string;
    difference: number;
    routeSplit: string[];
}


const columnsAsideOffsetTopRefs = ref<any[]>([]);
const columnsAsideActiveRef = ref<HTMLDivElement>();
const stores = useRoutesList();
const storesThemeConfig = useThemeConfig();
const { routesList, isColumnsMenuHover, isColumnsNavHover } = storeToRefs(stores);
const { themeConfig } = storeToRefs(storesThemeConfig);

const setMenuBus = useEventBus('setMenuList')
const setSendColumnsChildBus = useEventBus<any>('setSendColumnsChild')

const route = useRoute();
const router = useRouter();
const state = reactive<ColumnsAsideState>({
    columnsAsideList: [],
    liIndex: 0,
    liOldIndex: null,
    liHoverIndex: null,
    liOldPath: null,
    difference: 0,
    routeSplit: [],
});
// 设置菜单高亮位置移动
const setColumnsAsideMove = (k: number) => {
    if (!columnsAsideActiveRef.value) return
    state.liIndex = k;
    columnsAsideActiveRef.value.style.top = `${columnsAsideOffsetTopRefs.value[k].offsetTop + state.difference}px`;
};
// 菜单高亮点击事件
const onColumnsAsideMenuClick = (v: RouteRecordRaw, k: number) => {
    setColumnsAsideMove(k);
    let { path, redirect } = v;
    if (redirect) router.push(redirect as RouteLocation);
    else router.push(path);
};
// 鼠标移入时，显示当前的子级菜单
const onColumnsAsideMenuMouseenter = (v: RouteRecordRaw, k: number) => {
    let { path } = v;
    state.liOldPath = path;
    state.liOldIndex = k;
    state.liHoverIndex = k;
    setSendColumnsChildBus.emit(setSendChildren(path));
    stores.setColumnsMenuHover(false);
    stores.setColumnsNavHover(true);
};
// 鼠标移走时，显示原来的子级菜单
const onColumnsAsideMenuMouseleave = async () => {
    await stores.setColumnsNavHover(false);
    // 添加延时器，防止拿到的 store.state.routesList 值不是最新的
    await wait(100);
    if (!isColumnsMenuHover && !isColumnsNavHover) setMenuBus.emit();
};
// 设置高亮动态位置
const onColumnsAsideDown = (k: number) => {
    nextTick(() => {
        setColumnsAsideMove(k);
    });
};
// 设置/过滤路由（非静态路由/是否显示在菜单中）
const setFilterRoutes = () => {
    state.columnsAsideList = filterRoutesFun(routesList.value);
    const resData = setSendChildren(route.path);
    if (Object.keys(resData).length <= 0) return false;

    onColumnsAsideDown(resData.item[0].k);
    setSendColumnsChildBus.emit(resData);
};
// 传送当前子级数据到菜单中
const setSendChildren = (path: string) => {
    let routeList = state.columnsAsideList;
    // 当前路由为隐藏状态时
    if (route.meta.isHide) {
        routeList = routesList.value;
    }

    let arr_url = getParentId(routeList, path, 'path')
    let firstUrl = arr_url[0];

    // const currentPathSplit = path.split('/');
    // let firstUrl = currentPathSplit[0];

    let currentData: any = {};
    state.columnsAsideList.map((v, k: number) => {
        if (v.path === firstUrl) {
            // @ts-expect-error 正确de,k为新增进去的
            v['k'] = k;
            currentData['item'] = [{ ...v }];
            currentData['children'] = [{ ...v }];
            if (v.children) currentData['children'] = v.children;
        }
    });
    return currentData;
};
// 路由过滤递归函数
const filterRoutesFun = (arr: Array<RouteRecordRaw>) => {
    return arr.filter((item) => !item.meta?.isHide).map((item) => {
        item = Object.assign({}, item);
        if (item.children) item.children = filterRoutesFun(item.children);
        return item;
    });
};
// tagsView 点击时，根据路由查找下标 columnsAsideList，实现左侧菜单高亮
const setColumnsMenuHighlight = (path: string) => {

    state.routeSplit = path.split('/');
    state.routeSplit.shift();
    // const routeFirst = `/${state.routeSplit[0]}`;

    let arr_url: string[] = [];
    // 当前路由为隐藏状态时
    /** 注意:点击的时候，还没跳转页面,所以route.meta.isHide为false就用所有路由  */
    if (!route.meta.isHide) {
        arr_url = getParentId(routesList.value, path, 'path')
        state.columnsAsideList.map((v, k: number) => {
            // @ts-expect-error 增加k，计算active高亮移动位置
            if (v.path === arr_url[0]) v['k'] = k;
        });
    } else {
        arr_url = getParentId(state.columnsAsideList, path, 'path')
    }

    let routeFirst = arr_url[0];
    const currentSplitRoute = state.columnsAsideList.find((v) => v.path === routeFirst);
    if (!currentSplitRoute) return false;

    // 延迟拿值，防止取不到
    setTimeout(() => {
        // @ts-expect-error 正确de,k为新增进去的
        onColumnsAsideDown(currentSplitRoute.k);
    }, 0);
};

// 菜单名字过长截取
const setMenuTitle = (str: string) => {
    let len = themeConfig.value.columnsAsideLayout === 'columns-vertical' ? 5 : 3
    return str && str.length >= 5 ? str.substring(0, len) : str
}

// 监听布局配置信息的变化，动态增加菜单高亮位置移动像素
watch([themeConfig, stores], ([newTheme, newRoute]) => {
    state.difference = newTheme.columnsAsideStyle === 'columnsRound' ? 3 : 0

    if (!newRoute.isColumnsMenuHover && !newRoute.isColumnsNavHover) {
        state.liHoverIndex = null;
        setSendColumnsChildBus.emit(setSendChildren(route.path));
    } else {
        state.liHoverIndex = state.liOldIndex;
        if (!state.liOldPath) return false;
        setSendColumnsChildBus.emit(setSendChildren(state.liOldPath));
    }
})

// // 监听布局配置信息的变化，动态增加菜单高亮位置移动像素
// watch(pinia.state, (val) => {
//     val.themeConfig.themeConfig.columnsAsideStyle === 'columnsRound' ? (state.difference = 3) : (state.difference = 0);

//     if (!val.routesList.isColumnsMenuHover && !val.routesList.isColumnsNavHover) {
//         state.liHoverIndex = null;
//         setSendColumnsChildBus.emit(setSendChildren(route.path));
//     } else {
//         state.liHoverIndex = state.liOldIndex;
//         if (!state.liOldPath) return false;
//         setSendColumnsChildBus.emit(setSendChildren(state.liOldPath));
//     }
// }, {
//     deep: true,
// });

// 页面加载时
onMounted(() => {
    setFilterRoutes();
    // 销毁变量，防止鼠标再次移入时，保留了上次的记录
    setMenuBus.on(() => {
        state.liOldIndex = null;
        state.liOldPath = null;
    })
});

// 路由更新时
onBeforeRouteUpdate((to) => {
    setColumnsMenuHighlight(to.path);
    setSendColumnsChildBus.emit(setSendChildren(to.path));
});

const { columnsAsideList, liIndex, liHoverIndex } = toRefs(state)

</script>

<style scoped lang="scss">
.layout-columns-aside {
    width: 70px;
    height: 100%;
    background: var(--next-bg-columnsMenuBar);

    ul {
        position: relative;
        margin-top: 2px;

        li {
            color: var(--next-bg-columnsMenuBarColor);
            width: 100%;
            height: 50px;
            text-align: center;
            display: flex;
            cursor: pointer;
            position: relative;
            z-index: 1;

            .columns-vertical {
                margin: auto;

                .columns-vertical-title {
                    padding-top: 1px;
                }
            }

            .columns-horizontal {
                display: flex;
                height: 50px;
                width: 100%;
                align-items: center;
                padding: 0 5px;

                i {
                    margin-right: 3px;
                }

                a {
                    display: flex;

                    .columns-horizontal-title {
                        padding-top: 1px;
                    }
                }
            }

            a {
                text-decoration: none;
                color: var(--next-bg-columnsMenuBarColor);
            }
        }

        .layout-columns-active {
            color: var(--next-bg-columnsMenuBarColor) !important;
            transition: 0.3s ease-in-out;
        }

        .layout-columns-hover {
            color: var(--el-color-primary);

            a {
                color: var(--el-color-primary);
            }
        }

        .columns-round {
            background: var(--el-color-primary);
            color: var(--el-color-white);
            position: absolute;
            left: 50%;
            top: 0px;
            height: 48px;
            width: 65px;
            transform: translateX(-50%);
            z-index: 0;
            transition: 0.3s ease-in-out;
            border-radius: 5px;
        }

        .columns-card {
            @extend .columns-round;
            top: 0;
            height: 50px;
            width: 100%;
            border-radius: 0;
        }
    }
}
</style>
