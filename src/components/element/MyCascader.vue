<template>
    <el-cascader v-model="dat" :style="{ 'width': setElWidth(props.width as any) }" :props="props.props" clearable filterable
        @change="getChangeValue">
        <template #default="{ node, data: row }">
            <template v-if="!node.isLeaf">
                <span>{{ node.label }}</span>
                <span> ({{ node.children.length }}) </span>
            </template>
            <span v-else @click.stop="getLastPid(node, row)">{{ node.label }}</span>
        </template>
    </el-cascader>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from 'vue';
import { CascaderProps, ElCascader } from 'element-plus';

type PropsModelValue = string | number | string[] | number[]

const props = defineProps({
    modelValue: {
        type: [String, Number, Array] as PropType<PropsModelValue>,
        required: true
    },
    width: {
        type: [String, Number],
        default:''
    },
    props: {
        type: Object as PropType<CascaderProps>,
        default: () => {
        }
    },
})
const emits = defineEmits<{
    (e: 'update:modelValue', param: PropsModelValue): void
}>()

const dat = ref(props.modelValue);

const setElWidth = (wid?: string) => {
    if (!wid) return '';
    return Number.isNaN(Number(wid)) ? wid : wid + 'px'
}

// 级联选择事件
const getLastPid = (node: { valueByOption: PropsModelValue; isDisabled: boolean }, data: any) => {
    if (node.isDisabled) return
    dat.value = node.valueByOption
    emits("update:modelValue", node.valueByOption)
}

const getChangeValue = (val: PropsModelValue) => {
    let m = Array.isArray(val) ? [] : '';
    emits("update:modelValue", val ?? m)
}
watch(() => props.modelValue, (n, o) => {

    let m = Array.isArray(props.modelValue) ? [] : '';
    dat.value = n || m
})

</script>

<style lang="scss" scoped>

</style>