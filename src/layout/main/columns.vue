<template>
    <el-container v-if="isLoad" class="layout-container">
        <ColumnsAside />
        <div class="layout-columns-warp">
            <Asides />
            <!-- layout-backtop -->
            <el-container class="flex-center" :class="{ 'layout-backtop': !isFixedHeader }">
                <Headers v-if="isFixedHeader" />
                <el-scrollbar :class="{ 'layout-backtop': isFixedHeader }">
                    <Headers v-if="!isFixedHeader" />
                    <Mains v-if="isRouterAlive" />
                </el-scrollbar>
            </el-container>
        </div>
        <el-backtop target=".layout-backtop .el-scrollbar__wrap"></el-backtop>
    </el-container>
</template>

<script lang="ts" setup>
import { computed, ref, nextTick, provide } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '@/stores/themeConfig';
import Asides from '@/layout/components/aside.vue';
import Headers from '@/layout/components/header.vue';
import Mains from '@/layout/components/main.vue';
import ColumnsAside from '@/layout/components/columnsAside.vue';

const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const isFixedHeader = computed(() => {
    return themeConfig.value.isFixedHeader;
});

// 局部组件刷新
const isRouterAlive = ref(true);
const reload = () => {
    isRouterAlive.value = false;
    nextTick(() => {
        isRouterAlive.value = true;
    });
};
provide("mainReload", reload);


// 重新加载页面，监听页面为隐藏状态，用户为不活动状态
const isLoad = ref(true);
// const { idle, lastActive } = useIdle(10 * 60 * 1000)
// const visibility = useDocumentVisibility()
// watch(visibility, (newVal) => {
//     if (newVal == 'visible' && Date.now() > lastActive.value) {
//         isLoad.value = false;
//         nextTick(() => {
//             isLoad.value = true;
//         });
//     }
// })


</script>
