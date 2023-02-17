<template>
    <el-form ref="formRef" :model="ruleForm" :rules="rules" size="large" class="login-content-form"
        @submit.prevent="onSignIn">
        <el-form-item prop="userName">
            <el-input ref="userRef" v-model.trim="ruleForm.userName" type="text" maxlength="20" placeholder="请输入账号"
                clearable tabindex="1" @keyup.enter="onSignIn">
                <template #prefix>
                    <el-icon class="el-input__icon">
                        <ele-User />
                    </el-icon>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input v-model.trim="ruleForm.password" type="password" maxlength="20" placeholder="请输入密码" show-password
                tabindex="2" @keyup.enter="onSignIn">
                <template #prefix>
                    <el-icon class="el-input__icon">
                        <ele-Unlock />
                    </el-icon>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item prop="code">
            <el-col :span="15">
                <el-input v-model.trim="ruleForm.code" type="text" maxlength="4" placeholder="请输入验证码" clearable tabindex="3"
                    @keyup.enter="onSignIn">
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <ele-Position />
                        </el-icon>
                    </template>
                </el-input>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :span="8">
                <el-button class="login-content-code" @click="getCode">{{ state.verify }}</el-button>
            </el-col>
        </el-form-item>
        <el-form-item class="login-animation4">
            <el-button type="primary" class="login-content-submit" round :loading="state.loading.signIn" tabindex="4"
                @click="onSignIn">
                登 录
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import { reactive, computed, onBeforeMount, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElInput, ElMessage, FormInstance, FormRules } from 'element-plus';
import { Session } from '@/utils/storage';
import { formatAxis } from '@/utils/common/formatTime';
import { NextLoading } from '@/utils/loading';



const route = useRoute();
const router = useRouter();
const formRef = ref<FormInstance>()
const userRef = ref<InstanceType<typeof ElInput>>()

const state = reactive({
    verify: '1234',
    session_id: '',
    loading: {
        signIn: false,
    },
});

const ruleForm = reactive({
    userName: '',
    password: '',
    code: '',
})

const rules = reactive<FormRules>({
    userName: [
        { required: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    code: [
        { required: true, message: '必填项不能为空', trigger: 'blur' },
    ],
})


// 获取验证码
const getCode = async () => {


}



// 时间获取
const currentTime = computed(() => {
    return formatAxis(new Date());
});
// 登录
const onSignIn = async () => {
    if (state.loading.signIn) return;
    const isRun = await formRef.value?.validate((valid, fields) => valid ? true : false);
    if (!isRun) return;

    state.loading.signIn = true;

    Session.set('token', "1235463456646");
    signInSuccess();

};
// 登录成功后的跳转
const signInSuccess = () => {
    clearForm() //清空表单

    // 初始化登录成功时间问候语
    let currentTimeInfo = currentTime.value;
    // 登录成功，跳到转首页
    // 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
    if (route.query?.redirect) {
        router.push({
            path: route.query?.redirect as string,
            query: Object.keys(route.query?.params as string).length > 0 ? JSON.parse(route.query?.params as string) : '',
        });
    } else {
        router.push('/');
    }

    // 登录成功提示
    // 关闭 loading
    state.loading.signIn = true;
    const signInText = '欢迎回来！';
    ElMessage.success(`${currentTimeInfo}，${signInText}`);
    NextLoading.start();
};

// 清空表单
const clearForm = () => {
    formRef.value?.resetFields();
}

onBeforeMount(() => {
    getCode()
})
onMounted(() => {
    userRef.value?.focus();
})

</script>

<style scoped lang="scss">
.login-content-form {
    margin-top: 20px;

    @for $i from 1 through 4 {
        .login-animation#{$i} {
            opacity: 0;
            animation-name: error-num;
            animation-duration: 0.5s;
            animation-fill-mode: forwards;
            animation-delay: calc($i/10) + s;
        }
    }

    .login-content-password {
        display: inline-block;
        width: 20px;
        cursor: pointer;

        &:hover {
            color: #909399;
        }
    }

    .login-content-code {
        width: 100%;
        padding: 0;
        font-weight: bold;
        letter-spacing: 5px;
    }

    .login-content-submit {
        width: 100%;
        letter-spacing: 2px;
        font-weight: 300;
        margin-top: 15px;

        :deep(i.el-icon) {
            margin: 0;
        }
    }
}
</style>
