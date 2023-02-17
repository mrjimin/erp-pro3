<template>
    <template v-for="val in childList">
        <el-sub-menu v-if="val.children && val.children.length > 0" :key="val.path" :index="val.path">
            <template #title>
                <SvgIcon :name="val.meta.icon" />
                <span>{{ val.meta.title }}</span>
            </template>
            <sub-item :child="val.children" />
        </el-sub-menu>
        <template v-else>
            <el-menu-item :key="val.path" :index="val.path">
                <template v-if="!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)">
                    <SvgIcon :name="val.meta.icon" />
                    <span>{{ val.meta.title }}</span>
                    <!-- <span>{{ val.meta?.title }}
                        <el-tag v-if="setTipsTag(val)" type="danger" size="small" effect="dark" round>12</el-tag>
                    </span> -->
                </template>
                <template v-else>
                    <a :href="val.meta.isLink" target="_blank" rel="opener" class="w100">
                        <SvgIcon :name="val.meta.icon" />
                        {{ val.meta.title }}
                    </a>
                </template>
            </el-menu-item>
        </template>
    </template>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';

const props = defineProps({
    child: {
        type: Array as PropType<any[]>,
        default: () => [],
    },
})

// 获取父级菜单数据
const childList = computed(() => {
    return props.child;
});

</script>
