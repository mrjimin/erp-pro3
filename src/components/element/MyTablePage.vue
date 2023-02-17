<template>
    <div ref="tablePageRef" class="table-page">
        <div class="table-page-content">
            <slot :table-height="tableHeight"></slot>
        </div>
        <el-pagination v-if="defData.pagination.total" ref="pageRef" v-model:current-page="defData.pagination.page"
            v-model:page-size="defData.pagination.page_size" :small="smallSize"
            :page-sizes="defData.pagination.page_sizes" :total="defData.pagination.total" :pager-count="5" background
            layout="total, sizes, prev, pager, next, jumper" class="mt15" @size-change="onHandleSizeChange"
            @current-change="onHandleCurrentChange">
        </el-pagination>
    </div>
</template>

<script lang="ts" setup>
import { computed, PropType, reactive, ref } from 'vue';
import { ElPagination } from 'element-plus';
import { useElementBounding, useElementSize } from '@vueuse/core';
import { wait } from '@/utils/common';
import { globalComponentSize } from '@/utils/other';

// 分页
interface Pagination {
    total: number,
    page: number,
    page_size: number,
    page_sizes: number[],
}

const props = defineProps({
    page: {
        type: Object as PropType<Pagination>,
        required: true,
    },
    hide: {
        type: Boolean,
        default: false,
    },
    length: {
        type: Number,
        default: 0,
    },
})

const emits = defineEmits<{
    (e: 'update:page', param: Pagination): void,
}>()

// 高度变化，更新最大高度
const tablePageRef = ref<HTMLDivElement | null>(null);
const pageRef = ref<InstanceType<typeof ElPagination> | null>(null)
const { height: tHei } = useElementSize(tablePageRef);
const { height: pageHei } = useElementBounding(pageRef as never);
const tableHeight = computed(() => {
    let pHei = pageHei.value ? pageHei.value + 15 : 0
    let hei = Math.floor(tHei.value - pHei) % 2 ? Math.floor(tHei.value - pHei) - 1 : Math.floor(tHei.value - pHei);
    // unset\min-content
    return hei > 0 ? hei : 'unset'
})


// 默认数据列表
const defData = reactive({
    visible: false,
    pagination: props.page,
    time: 0,    // 用于分页和分页数量同时改变时，更新数据判断
});

// 获取全局组件大小
const smallSize = computed(() => {
    return globalComponentSize() === "small"
})

// 分页点击
const onHandleCurrentChange = (val: number) => {
    const { total, page_size } = defData.pagination;
    if (total < page_size && props.length == total) return

    defData.time = Date.now()
    emits("update:page", defData.pagination)
};
// 分页数量点击
const onHandleSizeChange = async (val: number) => {
    const { total, page_size } = defData.pagination;
    if (total < page_size && props.length == total) return
    // 分页跟分页数量同时改变时，通过时间去判断让他只调用一个方法
    await wait(10)  // 等待10ms，defData.time才可能是最新的
    if (Date.now() - defData.time < 20) return
    defData.time = Date.now()

    emits("update:page", defData.pagination)
};

</script>

<style lang="scss" scoped>
.table-page {
    display: flex;
    flex-direction: column;
    // min-height: 100%;
    height: 100%;
    overflow: auto;

    &-content {
        flex: 1;
    }
}
</style>