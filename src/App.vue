<template>
    <el-config-provider :size="globalSize" :locale="zhCn" :message="messageConfig">
        <router-view v-show="themeConfig.lockScreenTime > 1" />
        <LockScreen v-if="themeConfig.isLockScreen" />
    </el-config-provider>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, onMounted, onUnmounted, nextTick, reactive } from 'vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { storeToRefs } from 'pinia';
import { useTagsViewRoutes } from '@/stores/tagsViewRoutes';
import { useThemeConfig } from '@/stores/themeConfig';
import { globalComponentSize } from '@/utils/other';
import { Local, Session } from '@/utils/storage';
import LockScreen from '@/layout/lockScreen/index.vue';

const stores = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

// 提示框
const messageConfig = reactive({
    max: 1,
})

// 获取全局组件大小
const globalSize = ref(globalComponentSize())
// const globalSize = computed(() => {
//     return other.globalComponentSize();
// });

// 窗口大小改变时(改变组件大小)
const onLayoutResize = () => {
    const clientWidth = document.body.clientWidth;
    globalSize.value = clientWidth < 1000 ? 'small' : 'default'

};



// 设置初始化，防止刷新时恢复默认
onBeforeMount(() => {
    // 设置批量第三方 icon 图标
    // setIntroduction.cssCdn(cssCdnUrlList);
    // 设置批量第三方 js
    // setIntroduction.jsCdn();
});
// 页面加载时
onMounted(() => {
    nextTick(() => {

        // 获取缓存中的布局配置
        if (Local.get('themeConfig')) {
            storesThemeConfig.setThemeConfig(Local.get('themeConfig'));
            document.documentElement.style.cssText = Local.get('themeConfigStyle');
        }
        // 获取缓存中的全屏配置
        if (Session.get('isTagsViewCurrentFull')) {
            stores.setCurrentFullscreen(Session.get('isTagsViewCurrentFull'));
        }
    });
    window.addEventListener('resize', onLayoutResize);
});
// 页面销毁时，关闭监听布局配置/i18n监听
onUnmounted(() => {
    window.removeEventListener('resize', onLayoutResize);
});

</script>
<style>

</style>
