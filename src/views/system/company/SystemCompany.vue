<template>
    <my-box>
        <el-form ref="formRef" :model="formData" :inline="true" @submit.prevent="onSearch">
            <el-form-item>
                <el-input v-model="formData.keyword" style="width: 180px;" placeholder="请输入名称" clearable> </el-input>
            </el-form-item>
            <el-form-item>
                <el-cascader v-model="formData.class" :options="defData.classList"
                    :props="{ emitPath: false, value: 'id', label: 'group_name' }" placeholder="公司分类" filterable
                    clearable class="w100" />
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" @click="onSearch">
                    <el-icon>
                        <ele-Search />
                    </el-icon>
                    查询
                </el-button>
                <el-button type="success" @click="onOpenAdd">
                    <el-icon>
                        <ele-FolderAdd />
                    </el-icon>
                    新增
                </el-button>
            </el-form-item>
        </el-form>
        <my-table-page v-model:page="defData.pagination" class="jm-box" :length="defData.tableData.length"
            @update:page="onHandleCurrentChange">
            <template #default="{ tableHeight }">
                <el-table ref="tableRef" scrollbar-always-on :data="defData.tableData" :max-height="tableHeight">
                    <el-table-column prop="id" label="id" width="70" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="company_name" label="名称" min-width="220" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="type" label="公司分类" show-overflow-tooltip min-width="160">
                        <template #default="{ row }">
                            {{ row.group_name.join("/") }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="类型" show-overflow-tooltip width="100" align="center">
                        <template #default="{ row }">
                            <el-tag :type="row.is_main == 1 ? '' : 'success'">{{ row.type_text }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="price_rate_platform" label="平台采购倍率" show-overflow-tooltip align="center"
                        width="130"></el-table-column>
                    <el-table-column prop="price_rate" label="分公司采购倍率" show-overflow-tooltip align="center"
                        width="130"></el-table-column>
                    <el-table-column prop="contact" label="联系人" show-overflow-tooltip width="130"></el-table-column>
                    <el-table-column prop="phone" label="联系电话" show-overflow-tooltip width="135"></el-table-column>
                    <el-table-column prop="created_at" label="创建时间" show-overflow-tooltip width="170">
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" show-overflow-tooltip width="100" align="center">
                        <template #default="{ row }">
                            <el-button size="small" text type="primary" @click="onOpenEdit(row)">修改
                            </el-button>
                            <el-button v-if="0" size="small" text type="primary" @click="onDelete(row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </my-table-page>
        <WindowAdd ref="addRef" />
        <WindowEdit ref="editRef" />
    </my-box>
</template>

<script lang="ts" setup>
import { ref, reactive, onBeforeMount, provide } from 'vue';
import { ElMessageBox, ElMessage, ElTable } from 'element-plus';
import WindowAdd from '@/views/system/company/components/CompanyAdd.vue';
import WindowEdit from '@/views/system/company/components/CompanyEdit.vue';
import { PAGINATION } from '@/stores/global';

type tableDataItem=any

const addRef = ref<InstanceType<typeof WindowAdd> | null>(null)
const editRef = ref<InstanceType<typeof WindowEdit> | null>(null)
const tableRef = ref<InstanceType<typeof ElTable> | null>(null)

const defData = reactive({
    loading: false,
    tableData: [] as tableDataItem[],
    classList: [],
    pagination: {
        total: 0,
        ...PAGINATION
    },
});

const formData = reactive({
    keyword: '',
    class: '' as '' | number,
})
const initDefaultData = async () => {

}

// 初始化表格数据
const initTableData = async () => {


    tableRef.value?.setScrollTop(0)

};




// 打开新增菜单弹窗
const onOpenAdd = () => {
    addRef.value?.openDialog();
};
// 打开编辑菜单弹窗
const onOpenEdit = (row: tableDataItem) => {
    editRef.value?.openDialog(row);
};
// 删除当前行
const onDelete = (row: tableDataItem) => {

    // if (row.children?.length)  return   ElMessage.error('当前项下还有子类，不可删除')

    ElMessageBox.confirm(`此操作将永久删除该条内容, 是否继续?`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        buttonSize: 'default'
    }).then(async () => {

        ElMessage.success('删除成功');

        // let index = defData.tableData.indexOf(row);
        // if (index >= 0) defData.tableData.splice(index, 1)
        initTableData()
    }).catch(() => { });
};

// 查询
const onSearch = () => {
    initTableData()
}

// 分页改变
const onHandleCurrentChange = (param: typeof defData.pagination) => {

    initTableData()
}

// 注入
provide('initTable', initTableData)
// 页面加载时
onBeforeMount(() => {
    initDefaultData();
    initTableData();
});

</script>
<style lang="scss" scoped>

</style>