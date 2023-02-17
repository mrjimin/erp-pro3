<template>
    <component :is="curComponent" :class="themeConfig.layout" />
</template>

<script lang="ts" setup>
import { onBeforeMount, onUnmounted, defineAsyncComponent, shallowRef, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '@/stores/themeConfig';
import { Local } from '@/utils/storage';
import { useEventBus } from '@vueuse/core';

const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

const layoutResizeBus = useEventBus<{ clientWidth: number, layout: MainLayoutType }>('layoutMobileResize')

const curComponent = shallowRef();
const setLayout = () => {
    if (themeConfig.value.layout == 'classic') {
        curComponent.value = defineAsyncComponent(() => import('@/layout/main/classic.vue'))
    } else if (themeConfig.value.layout == 'transverse') {
        curComponent.value = defineAsyncComponent(() => import('@/layout/main/transverse.vue'))
    } else if (themeConfig.value.layout == 'defaults') {
        curComponent.value = defineAsyncComponent(() => import('@/layout/main/defaults.vue'))
    } else {
        curComponent.value = defineAsyncComponent(() => import('@/layout/main/columns.vue'))
    }
}


// 窗口大小改变时(适配移动端)
const onLayoutResize = () => {
    if (!Local.get('oldLayout')) Local.set('oldLayout', themeConfig.value.layout);
    const clientWidth = document.body.clientWidth;
    if (clientWidth < 1000) {
        themeConfig.value.isCollapse = false;
        themeConfig.value.globalComponentSize = 'small'

        layoutResizeBus.emit({
            layout: 'defaults',
            clientWidth,
        });
    } else {
        themeConfig.value.globalComponentSize = 'default'
        layoutResizeBus.emit({
            layout: Local.get('oldLayout') ? Local.get('oldLayout') : themeConfig.value.layout,
            clientWidth,
        });
    }
};
// 页面加载前
onBeforeMount(() => {
    onLayoutResize();
    setLayout();
    window.addEventListener('resize', onLayoutResize);
});
// 页面卸载时
onUnmounted(() => {
    window.removeEventListener('resize', onLayoutResize);
});
watch(() => themeConfig.value.layout, () => {
    setLayout();
})
</script>
