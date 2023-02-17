<template>
    <div v-if="isTagsViewCurrentFull" class="layout-navbars-close-full">
        <div class="layout-navbars-close-full-icon">
            <SvgIcon name="ele-Close" title="关闭全屏" @click="onCloseFullscreen" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useTagsViewRoutes } from '@/stores/tagsViewRoutes';


const stores = useTagsViewRoutes();
const { isTagsViewCurrentFull } = storeToRefs(stores);
// 关闭当前全屏
const onCloseFullscreen = () => {
    stores.setCurrentFullscreen(false);
};

</script>

<style scoped lang="scss">
.layout-navbars-close-full {
    position: fixed;
    z-index: 9999999999;
    right: -30px;
    top: -30px;

    .layout-navbars-close-full-icon {
        width: 60px;
        height: 60px;
        border-radius: 100%;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        position: relative;

        ::v-deep(i) {
            position: absolute;
            left: 10px;
            top: 35px;
            color: #333333;
            transition: all 0.3s ease;
        }
    }

    &:hover {
        transition: all 0.3s ease;

        ::v-deep(i) {
            color: var(--el-color-primary);
            transition: all 0.3s ease;
        }
    }
}
</style>
