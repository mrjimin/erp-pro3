<template>
    <el-menu class="menu-box" router :default-active="defaultActive" background-color="transparent"
        :collapse="isCollapse" :unique-opened="getThemeConfig.isUniqueOpened" :collapse-transition="false">
        <template v-for="val in menuLists">
            <el-sub-menu v-if="val.children && val.children.length > 0" :key="val.path" :index="val.path">
                <template #title>
                    <SvgIcon :name="val.meta!.icon" />
                    <span>{{ val.meta?.title }}</span>
                </template>
                <SubItem :child="val.children" />
            </el-sub-menu>
            <template v-else>
                <el-menu-item :key="val.path" :index="val.path">
                    <SvgIcon :name="val.meta!.icon" />
                    <template v-if="!val.meta?.isLink || (val.meta.isLink && val.meta.isIframe)" #title>
                        <!-- <el-badge :value="12" class="menu-badge">
                            <span>{{ val.meta?.title }}</span>
                        </el-badge> -->
                        <span>{{ val.meta?.title }}
                            <el-tag v-if="setTipsTag(val)" type="danger" size="small" effect="dark" round
                                disable-transitions>
                                {{ setTipsTag(val) }}
                            </el-tag>
                        </span>
                    </template>
                    <template v-else #title>
                        <a :href="val.meta.isLink" target="_blank" rel="opener" class="w100">{{ val.meta.title }}</a>
                    </template>
                </el-menu-item>
            </template>
        </template>
    </el-menu>
</template>

<script lang="ts" setup>
import { toRefs, reactive, computed, onMounted, watch, PropType } from 'vue';
import { useRoute, onBeforeRouteUpdate, RouteLocation, RouteRecordRaw } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '@/stores/themeConfig';
import SubItem from '@/layout/navMenu/subItem.vue';
import { getParentId } from '@/utils/common/tree';
import {  useRoutesList } from '@/stores/routesList';

const stores = useRoutesList();
const storesThemeConfig = useThemeConfig();
const { routesList } = storeToRefs(stores);
const { themeConfig } = storeToRefs(storesThemeConfig);

const route = useRoute();

const props = defineProps({
    menuList: {
        type: Array as PropType<RouteRecordRaw[]>,
        default: () => [],
    },
})

const state = reactive({
    // 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
    defaultActive: route.meta.isDynamic ? (route.meta.isDynamicPath as string) : route.path,
    isCollapse: false,
});
// 获取父级菜单数据
const menuLists = computed(() => {
    return props.menuList;
});
// 获取布局配置信息
const getThemeConfig = computed(() => {
    return themeConfig.value;
});
// 菜单高亮（详情时，父级高亮）
const setParentHighlight = (currentRoute: RouteLocation) => {
    const { path, meta } = currentRoute;

    let ids = getParentId(routesList.value, path, 'path');
    let activeUrl = path;
    if (ids.length >= 3 && meta.isHide) activeUrl = ids[1];
    return activeUrl

    // const pathSplit = meta.isDynamic ? meta.isDynamicPath.split('/') : path.split('/');
    // if (pathSplit.length >= 4 && meta.isHide) return pathSplit.splice(0, 3).join('/');
    // else return path;
};

// 是否显示标记
const setTipsTag = (param: RouteRecordRaw) => {
    if (!param.meta) return false

 
    return  ''

}


// 设置菜单的收起/展开
watch(
    themeConfig.value,
    () => {
        document.body.clientWidth <= 1000 ? (state.isCollapse = false) : (state.isCollapse = themeConfig.value.isCollapse);
    },
    {
        immediate: true,
    }
);
// 页面加载时
onMounted(() => {
    state.defaultActive = setParentHighlight(route);
});
// 路由更新时
onBeforeRouteUpdate((to) => {
    // 修复：https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
    state.defaultActive = setParentHighlight(to);
    const clientWidth = document.body.clientWidth;
    if (clientWidth < 1000) themeConfig.value.isCollapse = false;
});

const { defaultActive, isCollapse } = toRefs(state)

</script>
<style lang="scss" scoped>
.menu-box {
    width: 170px;
    --el-menu-icon-width: 18px;

    .el-menu-item * {
        vertical-align: middle;

        .el-tag {
            padding: 0 5px;
        }
    }

    .el-menu-item,
    .el-sub-menu {

        .iconfont,
        .fa {
            width: var(--el-menu-icon-width);
        }
    }
}

.menu-badge {
    line-height: 32px;

    :deep(.el-badge__content) {
        border: 0;
    }
}
</style>
