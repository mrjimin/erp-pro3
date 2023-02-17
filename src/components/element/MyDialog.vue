<template>
    <el-dialog v-model="visible" v-bind="$attrs" :fullscreen="defData.fullscreen" draggable @close="onClose">
        <template #header>
            <my-dialog-full v-model:fullscreen="defData.fullscreen" :text="props.title"></my-dialog-full>
        </template>
        <div class="dialog-body-box">
            <slot></slot>
        </div>
        <template #footer>
            <el-button @click="onCancel">取 消</el-button>
            <el-button type="primary" @click="onConfirm">确 定</el-button>
        </template>
    </el-dialog>
</template>
 
<script lang="ts" setup>



import { computed, reactive } from 'vue'
const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: '',
    },
})
const emits = defineEmits([
    // 'update:modelValue',
    'update:visible',
    'cancel',
    'close',
    'confirm',
])



const defData = reactive({
    visible: props.visible,
    fullscreen: false,
})


// 子组件定义自己的visible
const visible = computed({
    get: () => props.visible,
    set: (value) => {
        emits('update:visible', value)
    },
})
// 关闭弹窗
const onClose = () => {
    emits('close')
    visible.value = false
}

// 点击取消
const onCancel = () => {
    emits('cancel')
    visible.value = false
}

// 点击确定
const onConfirm = () => {

    emits('confirm')
    // visible.value = false
}
</script>
 
<style lang="scss">
.el-dialog.is-fullscreen {
    .dialog-body-box {
        height: 100%;
    }
}
</style>
 
<style lang="scss" scoped>
.dialog-body-box {
    display: flex;
    flex-direction: column;
    height: calc(90vh - 150px);

    :deep(>.dialog-flex) {
        flex: 1;
        overflow: auto;
    }
}
</style>