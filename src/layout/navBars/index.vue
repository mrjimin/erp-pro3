<template>
    <div class="layout-navbar-container">
        <BreadcrumbIndex />
        <TagsView v-if="setShowTagsView" />
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '@/stores/themeConfig';
import BreadcrumbIndex from '@/layout/navBars/breadcrumb/index.vue';
import TagsView from '@/layout/navBars/tagsView/tagsView.vue';

const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
// 是否显示 tagsView
const setShowTagsView = computed(() => {
    let { layout, isTagsView } = themeConfig.value;
    return layout !== 'classic' && isTagsView;
});

</script>

<style scoped lang="scss">
.layout-navbar-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
</style>
