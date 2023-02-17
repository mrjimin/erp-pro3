<template>
    <el-container class="layout-container flex-center">
        <Headers />
        <el-container class="layout-main-height-50">
            <Asides />
            <div class="flex-center layout-backtop">
                <TagsView v-if="themeConfig.isTagsView" />
                <Mains />
            </div>
        </el-container>
        <el-backtop target=".layout-backtop .el-main .el-scrollbar__wrap"></el-backtop>
    </el-container>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '@/stores/themeConfig';
import Asides from '@/layout/components/aside.vue';
import Headers from '@/layout/components/header.vue';
import Mains from '@/layout/components/main.vue';
import TagsView from '@/layout/navBars/tagsView/tagsView.vue';


const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

</script>
