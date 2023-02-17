<template>
    <el-header v-show="!isTagsViewCurrentFull" class="layout-header" :height="setHeaderHeight">
        <NavBarsIndex />
    </el-header>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '@/stores/themeConfig';
import { useTagsViewRoutes } from '@/stores/tagsViewRoutes';
import NavBarsIndex from '@/layout/navBars/index.vue';

const storesTagsViewRoutes = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isTagsViewCurrentFull } = storeToRefs(storesTagsViewRoutes);
// 设置 header 的高度
const setHeaderHeight = computed(() => {
    let { isTagsView, layout } = themeConfig.value;
    if (isTagsView && layout !== 'classic') return '84px';
    else return '50px';
});

</script>
