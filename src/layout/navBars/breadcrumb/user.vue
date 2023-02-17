<template>
    <div class="layout-navbars-breadcrumb-user pr15">
        <!--:style="{ flex: layoutUserFlexNum }" -->

        <template v-if="userState.state">
            <el-dropdown :show-timeout="70" :hide-timeout="50" trigger="click" @command="onComponentSizeChange">
                <div class="layout-navbars-breadcrumb-user-icon">
                    <i class="iconfont icon-ziti" title="组件大小"></i>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="large" :disabled="state.disabledSize === 'large'">大型
                        </el-dropdown-item>
                        <el-dropdown-item command="default" :disabled="state.disabledSize === 'default'">默认
                        </el-dropdown-item>
                        <el-dropdown-item command="small" :disabled="state.disabledSize === 'small'">小型
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <div class="layout-navbars-breadcrumb-user-icon" @click="onLayoutSettingClick">
                <i class="icon-skin iconfont" title="布局配置"></i>
            </div>
        </template>
        <div class="layout-navbars-breadcrumb-user-icon" @click="onSearchClick">
            <el-icon title="菜单搜索">
                <ele-Search />
            </el-icon>
        </div>
        <div class="layout-navbars-breadcrumb-user-icon">
            <UserNews />
        </div>
        <div class="layout-navbars-breadcrumb-user-icon mr10" @click="onScreenFullClick">
            <i class="iconfont" :title="state.isScreenFull ? '关全屏' : '开全屏'"
                :class="!state.isScreenFull ? 'icon-fullscreen' : 'icon-exit-fullscreen'"></i>
        </div>
        <el-dropdown :show-timeout="70" :hide-timeout="50" @command="onHandleCommandClick">
            <span class="layout-navbars-breadcrumb-user-link">
                <!-- <el-avatar v-if="userInfos.photo" :src="userInfos.photo" :size="2
                " class="mr5" /> -->
                <el-avatar icon="ele-UserFilled" :size="25" class="mr5" />
                {{ state.name }}
                <el-icon class="el-icon--right">
                    <ele-ArrowDown />
                </el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="/">首页</el-dropdown-item>
                    <el-dropdown-item command="change">修改密码</el-dropdown-item>
                    <el-dropdown-item command="clear">清空后台缓存</el-dropdown-item>
                    <!-- <el-dropdown-item command="/401">401</el-dropdown-item> -->
                    <el-dropdown-item divided command="logOut">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
        <Search ref="searchRef" />

        <Teleport to="#app">
            <Settings v-show="userState.state && themeConfig.lockScreenTime > 1" ref="settingsRef" />
            <EditPwd ref="editPwdRef" />
        </Teleport>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted,  defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';

import { storeToRefs } from 'pinia';
import { useUserInfo } from '@/stores/userInfo';
import { useThemeConfig } from '@/stores/themeConfig';
import { Session, Local } from '@/utils/storage';
import UserNews from '@/layout/navBars/breadcrumb/userNews.vue';
import Search from '@/layout/navBars/breadcrumb/search.vue';
// import Settings from '@/layout/navBars/breadcrumb/settings.vue';
import EditPwd from '@/layout/navBars/breadcrumb/editPwd.vue';
import { useFullscreen } from '@vueuse/core';
import { CommonApi } from '@/api/common';


const userState = useUserInfo();

// const mainReload = inject<() => void>("mainReload")

const router = useRouter();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

const Settings = defineAsyncComponent(() => import('@/layout/navBars/breadcrumb/settings.vue'));



const searchRef = ref<InstanceType<typeof Search>>();
const settingsRef = ref<InstanceType<typeof Settings>>();
const editPwdRef = ref<InstanceType<typeof EditPwd>>();

const state = reactive({
    isScreenFull: false,
    disabledI18n: 'zh-cn',
    disabledSize: 'large',
    name: 'admin'
});
// // 设置分割样式
// const layoutUserFlexNum = computed(() => {
//     let num: string | number = '';
//     const { layout, isClassicSplitMenu } = themeConfig.value;
//     const layoutArr: string[] = ['defaults', 'columns'];
//     if (layoutArr.includes(layout) || (layout === 'classic' && !isClassicSplitMenu)) num = '1';
//     else num = '';
//     return num;
// });


// 全屏点击时
const { isSupported, isFullscreen, toggle } = useFullscreen();
const onScreenFullClick = () => {
    if (!isSupported) return ElMessage.warning('暂不不支持全屏');
    toggle();   // 全屏切换
    state.isScreenFull = !isFullscreen.value
};
// 布局配置 icon 点击时
const onLayoutSettingClick = () => {
    settingsRef.value?.openDrawer();
};
// 下拉菜单点击时
const onHandleCommandClick = async (path: string) => {
    if (path === 'logOut') {
        ElMessageBox({
            closeOnClickModal: false,
            closeOnPressEscape: false,
            title: '提示',
            message: '此操作将退出登录, 是否继续?',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            buttonSize: 'default',
            beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = '退出中';
                    setTimeout(() => {
                        Local.clear();
                        Session.clear(); // 清除缓存/token等
                        done();
                        setTimeout(() => {
                            instance.confirmButtonLoading = false;
                        }, 300);
                    }, 700);
                } else {
                    done();
                }
            },
        }).then(async () => {
            Session.clear(); // 清除缓存/token等
            // 使用 reload 时，不需要调用 resetRoute() 重置路由
            window.location.reload();
        }).catch(() => { });
    } else if (path === 'change') {
        editPwdRef.value?.openDialog();
    } else if (path === 'clear') {
        // const res = await CommonApi.clear();
        // if (res.code != 200) return ElMessage.error(res.msg);
        ElMessage.success("清除成功")
        window.location.reload();
        // mainReload?.()
    } else {
        router.push(path);
    }
};
// 菜单搜索点击
const onSearchClick = () => {

    searchRef.value?.openSearch();
};
// 组件大小改变
const onComponentSizeChange = (size: "default" | "small" | "large") => {
    Local.remove('themeConfig');
    themeConfig.value.globalComponentSize = size;
    Local.set('themeConfig', themeConfig.value);
    initComponentSize();
    window.location.reload();
};
// 初始化全局组件大小
const initComponentSize = () => {
    switch (Local.get('themeConfig').globalComponentSize) {
        case 'large':
            state.disabledSize = 'large';
            break;
        case 'default':
            state.disabledSize = 'default';
            break;
        case 'small':
            state.disabledSize = 'small';
            break;
    }
};







// 页面加载时
onMounted(() => {
    if (Local.get('themeConfig')) {
        initComponentSize();
    }
});

</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    &-link {
        height: 100%;
        display: flex;
        align-items: center;
        white-space: nowrap;

        &-photo {
            width: 25px;
            height: 25px;
            border-radius: 100%;
        }
    }

    &-icon {
        padding: 0 10px;
        cursor: pointer;
        color: var(--next-bg-topBarColor);
        height: 50px;
        line-height: 50px;
        display: flex;
        align-items: center;

        &:hover {
            background: var(--next-color-user-hover);

            i {
                display: inline-block;
                animation: logoAnimation 0.3s ease-in-out;
            }
        }
    }

    &-vendor {
        color: var(--next-bg-topBarColor);
    }

    :deep(.el-dropdown) {
        color: var(--next-bg-topBarColor);
    }

    :deep(.el-badge) {
        height: 40px;
        line-height: 40px;
        display: flex;
        align-items: center;
    }

    :deep(.el-badge__content.is-fixed) {
        top: 12px;
    }
}
</style>
<style lang="scss">
.el-dropdown-menu__item {
    &.hov {
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
    }

    &.group-item {
        font-size: 13px;
        padding: 3px 16px;
        cursor: default;
    }

    &.input-menu-item {
        position: sticky;
        top: 0;
        left: 0;
        background-color: #fff;
    }
}
</style>
