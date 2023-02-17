<template>
    <div ref="tablePageRef" class="table-page">
        <div class="table-page-content">
            <el-table ref="tableRef" v-bind="$attrs" :data="props.data" :max-height="tableHeight">
                <el-table-column v-for="(item, index) in headerList" :key="index" v-bind="(item as any)"
                    show-overflow-tooltip>
                    <template v-if="item.slotHeader" #header="scope">
                        <slot :name="item.property + 'Header'" :scopes="scope"></slot>
                    </template>
                    <!-- 这里根据slot字段来判断是否使用插槽 -->
                    <template v-if="item.type !== 'selection'" #default="scope">
                        <slot v-if="item.slot" :name="item.property" :scopes="scope"></slot>
                        <span v-else>{{ scope.row[item.property] }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- <el-popover :width="300" popper-class="popover-box" trigger="click" @show="onSetTable">
            <template #reference>
                <el-avatar src="https://avatars.githubusercontent.com/u/72015883?v=4" />
            </template>
            <template #default>
                <ul ref="moveRef" class="move-box">
                    <li v-for="(item, index) in setHeader" :key="index" :data-key="item.property">
                        <el-icon class="move-icon mr5"><ele-Rank /></el-icon><el-checkbox v-model="item.check"
                            :label="item.label" />
                    </li>
                </ul>
            </template>
        </el-popover> -->
        <el-pagination v-if="defData.pagination.total" ref="pageRef" v-model:current-page="defData.pagination.page"
            v-model:page-size="defData.pagination.page_size" :small="smallSize"
            :page-sizes="defData.pagination.page_sizes" :total="defData.pagination.total" :pager-count="5" background
            layout="total, sizes, prev, pager, next, jumper" class="mt15" @size-change="onHandleSizeChange"
            @current-change="onHandleCurrentChange">
        </el-pagination>
    </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, PropType, reactive, ref } from 'vue';
import { ElPagination, ElTable, ElTableColumn, TableInstance } from 'element-plus';
import { useElementBounding, useElementSize } from '@vueuse/core';
import { wait } from '@/utils/common';
import { globalComponentSize } from '@/utils/other';
import Sortable from 'sortablejs';




// 分页
type Pagination = TableType["pagination"]

type TableHeaderType = TableType["tableHeader"] | typeof ElTableColumn[]

// type PropsDataType={
//     data:TableType["data"],
//     tableHeader:TableType["tableHeader"] | typeof ElTableColumn[],
//     page:TableType["pagination"],
//     hide?:boolean
// }

// const props=defineProps<PropsDataType>()

const props = defineProps({
    data: {
        type: Array as PropType<TableType["data"]>,
        default: () => []
    },
    tableHeader: {
        type: Array as PropType<TableHeaderType>,
        required: true,
    },
    page: {
        type: Object as PropType<TableType["pagination"]>,
        required: true,
    },
    hide: {
        type: Boolean,
        default: false,
    },
})

const emits = defineEmits<{
    (e: 'update:page', param: Pagination): void,
    (e: 'update:table-header', param: TableHeaderType): void,
}>()

const tableRef = ref<TableInstance>()

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

// 属性透传，去除id、class、style，不传入el-table组件
// const attrs = useAttrs();
// const newAttrs = computed(() => {
//     const att = deepClone(attrs);
//     if (att.style) delete att.style;
//     if (att.class) delete att.class;
//     if (att.id) delete att.id;
//     return att
// })


// const columnAttrs = (item: TableHeaderType[0]):any => {
//     const attr = deepClone(item);
//     attr.property = String(attr.property);
//     if (attr.slot) delete attr.slot;
//     return attr
// }

// 分页点击
const onHandleCurrentChange = (val: number) => {
    const { total, page_size } = defData.pagination;
    if (total < page_size && props.data.length == total) return

    defData.time = Date.now()
    emits("update:page", defData.pagination)
};
// 分页数量点击
const onHandleSizeChange = async (val: number) => {
    const { total, page_size } = defData.pagination;
    if (total < page_size && props.data.length == total) return
    // 分页跟分页数量同时改变时，通过时间去判断让他只调用一个方法
    await wait(10)  // 等待10ms，defData.time才可能是最新的
    if (Date.now() - defData.time < 20) return
    defData.time = Date.now()

    emits("update:page", defData.pagination)
};

const headerList = computed(() => {

    return props.tableHeader.map(item => item)
})
const setHeader = ref(props.tableHeader);
// 设置 tool header 数据
// const setHeader = computed(() => {
// 	return props.header.filter((v) => v.isCheck);
// });
const moveRef = ref<HTMLDivElement>()
// 设置
const onSetTable = () => {
    nextTick(() => {
        const sortable = Sortable.create(moveRef.value, {
            handle: '.move-icon',
            dataIdAttr: 'data-key',
            animation: 150,
            onEnd: () => {
                console.log('sortable :>> ', sortable);
                const headerList: TableHeaderType = [];
                sortable.toArray().forEach((val: string) => {
                    console.log('val :>> ', val);
                    (props.tableHeader as any[]).forEach((v) => {
                        if (v.property === val) headerList.push({ ...v });
                    });
                    // let node = (props.tableHeader as any[]).find(item => item.property === val)
                    // if (node) headerList.push({...node});
                });
                console.log('headerList :>> ', headerList);
                console.log('props.tableHeader :>> ', props.tableHeader);
                // setHeader.value=headerList;
                emits('update:table-header', headerList);
            },
        });
    });
};



defineExpose({
    tableRef: tableRef,
})

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
<style lang="scss">
.popover-box {
    padding: 3px 0 !important;

    .move-box li {
        padding: 0 10px;
        list-style: none;

        &:hover {
            background-color: var(--el-fill-color-light);
        }
    }
}
</style>