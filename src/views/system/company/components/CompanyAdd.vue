<template>
    <el-dialog v-model="defData.visible" draggable :title="'新增' + defData.typeName" width="680px">
        <el-form ref="formRef" :model="form.data" :rules="rules" label-width="120px">
            <el-row>
                <el-col :xs="24" :sm="20" :md="20" :lg="20" :xl="20" class="mb20">
                    <el-form-item :label="defData.typeName + '名称'" prop="company_name">
                        <el-input v-model="form.data.company_name" :placeholder="'请输入' + defData.typeName + '名称'"
                            maxlength="50" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18" class="mb20">
                    <el-form-item label="公司分类" prop="class_id">
                        <el-cascader v-model="form.data.class_id" :options="defData.classList"
                            :props="{ emitPath: false, value: 'id', label: 'group_name' }" clearable class="w100" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="13" :md="13" :lg="13" :xl="13" class="mb20">
                    <el-form-item label="负责人" prop="contact">
                        <el-input v-model="form.data.contact" placeholder="请输入名字" maxlength="30" clearable>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="13" :md="13" :lg="13" :xl="13" class="mb20">
                    <el-form-item label="手机号码" prop="phone">
                        <el-input v-model.trim="form.data.phone" placeholder="请输入手机号码" maxlength="11" clearable>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="18" :md="16" :lg="16" :xl="16" class="mb20">
                    <el-form-item label="地区" prop="city">
                        <el-cascader v-model="form.data.city" :options="regionData" filterable clearable class="w100"
                            @change="chooseCity">
                        </el-cascader>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                    <el-form-item label="详细地址" prop="address">
                        <el-input v-model.trim="form.data.address" type="textarea" maxlength="150" show-word-limit
                            placeholder="请输入详细地址" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                    <el-form-item label="平台采购倍率" prop="main_ratio">
                        <el-input-number v-model="form.data.main_ratio" :min="1" :max="100" :precision="2"
                            controls-position="right" clearable></el-input-number>
                        <span class="ml5" style="color: #999;">该公司向平台采购的价格（库存成本价 * 倍率）</span>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                    <el-form-item label="分公司采购倍率" prop="branch_ratio">
                        <el-input-number v-model="form.data.branch_ratio" :min="1" :max="100" :precision="2"
                            controls-position="right" clearable></el-input-number>
                        <span class="ml5" style="color: #999;">该公司向分公司采购的价格（库存成本价 * 倍率）</span>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="onCancel">取 消</el-button>
                <el-button type="primary" @click="onSubmit" :loading="defData.loading.submit">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, onMounted, computed, ref} from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { regionData } from '@/utils/files/address';



const formRef = ref<FormInstance | null>(null)
const defData = reactive({
    visible: false,
    classList: [],
    typeName: computed(() => form.data.type == 1 ? '公司' : '部门'),
    loading: {
        submit: false,
    }
});

const form = reactive({
    data: {
        type: 1,     //类型
        company_name: '',    //公司名称
        class_id: '' as '' | number,    // 分类id
        contact: '', // 负责人
        phone: '', // 手机号
        main_ratio: 1,
        branch_ratio: 1,
        city: [] as string[], //地区
        address: '', //详细地址
    },
})

const rules = reactive<FormRules>({
    company_name: [
        { required: true, message: "必填项不能为空", trigger: 'blur' }
    ],
    class_id: [
        { required: true, message: "必填项不能为空", trigger: 'blur' }
    ],
    contact: [
        { required: true, message: "必填项不能为空", trigger: 'blur' }
    ],
    phone: [
        { required: true, pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0|1,5-9])|(19[0-9]))\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ],
    city: [
        { required: true, message: "必填项不能为空", trigger: 'blur' }
    ],
    address: [
        { required: true, message: "必填项不能为空", trigger: 'blur' }
    ],
})

// 初始化部门数据
const initDefaultData = async () => {

};

// 地区选择(验证字段)
const chooseCity = () => {
    // if (!form.data.city || form.data.city.length == 0) {}
    formRef.value?.validateField('city')

}

// 打开弹窗
const openDialog = () => {

    defData.visible = true;
};
// 关闭弹窗
const closeDialog = () => {
    defData.visible = false;
    formRef.value?.resetFields()
};
// 取消
const onCancel = () => {
    closeDialog();
};
// 新增
const onSubmit = async () => {
    const isRun = await formRef.value?.validate(val => val ? true : false)
    if (!isRun) return ElMessage.error('必填项不能为空')


    ElMessage.success('提交成功');

    closeDialog();
};


// 页面加载时
onMounted(() => {
    initDefaultData();
});
defineExpose({
    openDialog
})
</script>
<style lang="scss" scoped>

</style>
