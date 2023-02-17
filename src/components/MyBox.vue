<template>
    <div :class="[props.minHeight ? 'min-hei' : 'max-box', props.noTheme ? 'no-theme' : 'box-theme']">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '@/stores/themeConfig';
import { useTagsViewRoutes } from '@/stores/tagsViewRoutes';
const storesTagsViewRoutes = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isTagsViewCurrentFull } = storeToRefs(storesTagsViewRoutes);

const props = defineProps({
    minHeight: {
        type: Boolean,
        default: false
    },
    noTheme: {
        type: Boolean,
        default: false
    }
})

// 设置主内容的高度
const initTagViewHeight = computed(() => {
    let { isTagsView } = themeConfig.value;
    
    if (isTagsViewCurrentFull.value) return `30px`
    else return isTagsView ? `114px` : `80px`;

});

</script>


<style lang="scss" scoped>
$height: calc(100vh - v-bind(initTagViewHeight));

.box-theme {
    background: var(--el-color-white);
    border: 1px solid var(--el-border-color-light, #ebeef5);
    border-radius: 4px;
    width: 100%;
}

.max-box {
    overflow: auto;
    height: $height;
    position: relative;
    z-index: 3;
    padding: 20px;
    display: flex;
    flex-direction: column;

    >:deep(*) {
        flex-shrink: 0;
    }

    >:deep(.jm-box) {
        flex: 1;
        overflow: auto;
        margin: 0 -20px;
        padding: 0 20px;
    }
}

.min-hei {
    min-height: $height;
    padding: 20px;

    &.no-theme {
        padding: 0;
    }
}
</style>