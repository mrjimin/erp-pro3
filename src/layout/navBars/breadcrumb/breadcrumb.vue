<template>
    <div v-if="isShowBreadcrumb" class="layout-navbars-breadcrumb">
        <SvgIcon class="layout-navbars-breadcrumb-icon" :name="themeConfig.isCollapse ? 'ele-Expand' : 'ele-Fold'"
            :size="16" @click="onThemeConfigChange" />
        <el-breadcrumb class="layout-navbars-breadcrumb-hide layout-breadcrumb-text">
            <transition-group name="breadcrumb">
                <el-breadcrumb-item v-for="(v, k) in breadcrumbList2" :key="k">
                    <!-- 最后一个时 -->
                    <!-- v.meta.tagsViewName ? v.meta.tagsViewName :  -->
                    <span v-if="k === breadcrumbList2.length - 1" :title="v.meta?.title"
                        class="layout-navbars-breadcrumb-span">
                        <SvgIcon v-if="themeConfig.isBreadcrumbIcon" :name="v.meta!.icon"
                            class="layout-navbars-breadcrumb-iconfont" />

                        <span class="layout-breadcrumb-name">
                            <!-- v.meta.tagsViewName ? v.meta.tagsViewName :  -->
                            {{ v.meta?.title }}
                        </span>
                    </span>
                    <a v-else :title="v.meta?.title" @click.prevent="onBreadcrumbClick(v)">
                        <SvgIcon v-if="themeConfig.isBreadcrumbIcon" :name="v.meta!.icon"
                            class="layout-navbars-breadcrumb-iconfont" />
                        <span class="layout-breadcrumb-name">{{ v.meta?.title }}</span>
                    </a>
                </el-breadcrumb-item>
            </transition-group>
        </el-breadcrumb>
    </div>
</template>

<script lang="ts" setup>
import { toRefs, reactive, computed, onMounted } from 'vue';
import { onBeforeRouteUpdate, RouteRecordRaw, useRoute, useRouter } from 'vue-router';
import { Local } from '@/utils/storage';
import { setTagsViewNameI18n } from '@/utils/other';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '@/stores/themeConfig';
import { useRoutesList } from '@/stores/routesList';
import { getParentRouterId } from '@/utils/common/tree';

// 定义接口来定义对象的类型
interface BreadcrumbState {
    breadcrumbList: Array<RouteRecordRaw>;
    routeSplit: Array<string>;
    routeSplitFirst: string;
    routeSplitIndex: number;
    breadcrumbList2: Array<RouteRecordRaw>;
}


const stores = useRoutesList();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { routesList } = storeToRefs(stores);
const route = useRoute();
const router = useRouter();
const state = reactive<BreadcrumbState>({
    breadcrumbList: [],
    routeSplit: [],
    routeSplitFirst: '',
    routeSplitIndex: 1,
    breadcrumbList2: [],
});

// 动态设置经典、横向布局不显示
const isShowBreadcrumb = computed(() => {
    initRouteSplit(route.path);
    const { layout, isBreadcrumb } = themeConfig.value;
    if (layout === 'classic' || layout === 'transverse') return false;
    else return isBreadcrumb ? true : false;
});
// 面包屑点击时
const onBreadcrumbClick = (v: any) => {
    const { redirect, path } = v;
    if (redirect) router.push(redirect);
    else router.push(path);
};
// 展开/收起左侧菜单点击
const onThemeConfigChange = () => {
    themeConfig.value.isCollapse = !themeConfig.value.isCollapse;
    setLocalThemeConfig();
};
// 存储布局配置
const setLocalThemeConfig = () => {
    Local.remove('themeConfig');
    Local.set('themeConfig', themeConfig.value);
};
// 处理面包屑数据
const getBreadcrumbList = (arr: Array<RouteRecordRaw>) => {

    arr.forEach((item: any) => {
        state.routeSplit.forEach((v: any, k: number, list: any) => {
            if (state.routeSplitFirst === item.path) {
                state.routeSplitFirst += `/${list[state.routeSplitIndex]}`;
                state.breadcrumbList.push(item);
                state.routeSplitIndex++;
                if (item.children) getBreadcrumbList(item.children);
            }
        });
    });
};
// 当前路由字符串切割成数组，并删除第一项空内容
const initRouteSplit = (path: string) => {

    // findAllParent()
    if (!themeConfig.value.isBreadcrumb) return false;
    state.breadcrumbList = [routesList.value[0]];


    state.routeSplit = path.split('/');
    state.routeSplit.shift();
    state.routeSplitFirst = `/${state.routeSplit[0]}`;
    state.routeSplitIndex = 1;
    getBreadcrumbList(routesList.value);
    if (route.name === 'HomeIndex' || (route.name === '404' && state.breadcrumbList.length > 1)) state.breadcrumbList.shift();
    if (state.breadcrumbList.length > 0) state.breadcrumbList[state.breadcrumbList.length - 1].meta!.tagsViewName = setTagsViewNameI18n(route);

};


// 面包屑导航设置数据
const initBreadcrumb = (id: any) => {
    let routerArr = router.getRoutes();
    // 获取上级所有id
    let ids = getParentRouterId(routesList.value, id);

    let list = ids.map(val => {
        let filArr = routerArr.filter(item => val == item.meta.id)
        let ax = { ...filArr[0] };
        ax.children = [];
        return ax;
    })

    if (list.length != 1) {
        list.unshift(routesList.value[0] as never)
    }
    if (list[list.length - 1].name == "HomeIndex") {
        list = [list[list.length - 1]]
    }

    state.breadcrumbList2 = list
}


// 页面加载时
onMounted(() => {

    initBreadcrumb(route.meta.id)
    initRouteSplit(route.path);
});
// 路由更新时
onBeforeRouteUpdate((to) => {
    initBreadcrumb(to.meta.id)
    initRouteSplit(to.path);
});
const { breadcrumbList2 } = toRefs(state)

</script>

<style scoped lang="scss">
.layout-breadcrumb-name {
    max-width: 180px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.layout-navbars-breadcrumb {
    flex: 1;
    height: inherit;
    display: flex;
    align-items: center;

    .layout-navbars-breadcrumb-icon {
        cursor: pointer;
        font-size: 18px;
        color: var(--next-bg-topBarColor);
        height: 100%;
        width: 40px;
        opacity: 0.8;

        &:hover {
            opacity: 1;
        }
    }

    .layout-navbars-breadcrumb-span {
        display: flex;
        opacity: 0.7;
        color: var(--next-bg-topBarColor);
    }

    .layout-navbars-breadcrumb-iconfont {
        font-size: 14px;
        margin-right: 5px;
    }

    ::v-deep(.el-breadcrumb__separator) {
        opacity: 0.7;
        color: var(--next-bg-topBarColor);
    }

    ::v-deep(.el-breadcrumb__inner a, .el-breadcrumb__inner.is-link) {
        font-weight: unset !important;
        color: var(--next-bg-topBarColor);

        &:hover {
            color: var(--el-color-primary) !important;
        }
    }
}
</style>
