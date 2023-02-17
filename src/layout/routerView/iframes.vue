<template>
    <div v-loading="iframeLoading" class="layout-view-bg-white flex mt1"
        :style="{ height: `calc(100vh - ${setIframeHeight}`, border: 'none' }">
        <iframe v-show="!iframeLoading" ref="iframeDom" :src="iframeUrl" frameborder="0" height="100%"
            width="100%"></iframe>
    </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onMounted, nextTick, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useThemeConfig } from '@/stores/themeConfig';
import { useTagsViewRoutes } from '@/stores/tagsViewRoutes';


const storesThemeConfig = useThemeConfig();
const storesTagsViewRoutes = useTagsViewRoutes();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isTagsViewCurrentFull } = storeToRefs(storesTagsViewRoutes);
const route = useRoute();
const state = reactive({
    iframeDom: null as HTMLIFrameElement | null,
    iframeLoading: true,
    iframeUrl: '',
});
// 初始化页面加载 loading
const initIframeLoad = () => {
    state.iframeUrl = route.meta.linkUrl;
    nextTick(() => {
        state.iframeLoading = true;
        const iframe = state.iframeDom;
        if (!iframe) return false;
        iframe.onload = () => {
            state.iframeLoading = false;
        };
    });
};
// 设置 iframe 的高度
const setIframeHeight = computed(() => {
    let { isTagsView } = themeConfig.value;
    if (isTagsViewCurrentFull.value) {
        return `1px`;
    } else {
        if (isTagsView) return `86px`;
        else return `51px`;
    }
});
// 页面加载时
onMounted(() => {
    initIframeLoad();
});
// 监听路由变化，多个 iframe 时使用
watch(
    () => route.path,
    () => {
        initIframeLoad();
    }
);


const { iframeDom, iframeLoading, iframeUrl } = toRefs(state)

</script>
