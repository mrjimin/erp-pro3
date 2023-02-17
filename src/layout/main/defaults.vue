<template>
    <el-container class="layout-container">
        <Asides />
        <el-container class="flex-center" :class="{ 'layout-backtop': !isFixedHeader }">
            <Headers v-if="isFixedHeader" />
            <el-scrollbar ref="layoutDefaultsScrollbarRef" :class="{ 'layout-backtop': isFixedHeader }">
                <Headers v-if="!isFixedHeader" />
                <Mains v-if="isRouterAlive" />
            </el-scrollbar>
        </el-container>
        <el-backtop target=".layout-backtop .el-scrollbar__wrap"></el-backtop>
    </el-container>
</template>

<script lang="ts" setup>
import { computed, watch, ref, nextTick, provide } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '@/stores/themeConfig';
import Asides from '@/layout/components/aside.vue';
import Headers from '@/layout/components/header.vue';
import Mains from '@/layout/components/main.vue';
import { ElScrollbar } from 'element-plus';


const layoutDefaultsScrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const route = useRoute();
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

// 监听路由的变化
watch(
    () => route.path,
    () => {
        layoutDefaultsScrollbarRef.value!.wrapRef!.scrollTop=0
    }
);

</script>
