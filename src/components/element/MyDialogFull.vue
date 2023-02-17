<template>
    <span class="el-dialog__title">
        {{ props.text }}
    </span>
    <button v-if="!props.hidden" class="dialog-full el-dialog__headerbtn" @click="onToggle">
        <SvgIcon class="el-dialog__close" :class="{ active: iconName=='ele-CopyDocument' }" :name="iconName" />
    </button>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';

const props = defineProps({
    hidden: {
        type: Boolean,
        default: false,
    },
    text: {
        type: String,
        default:''
    },
    fullscreen: {
        type: Boolean,
        default: false,
    }
})

const emits = defineEmits<{
    (e: 'update:fullscreen', param: boolean): void
}>()

const defData = reactive({
    visible: false,
    fullscreen: props.fullscreen,
});

const iconName = computed(() => {
    return props.fullscreen ? 'ele-CopyDocument' : 'ele-FullScreen'
})

const onToggle = () => {
    defData.fullscreen = !defData.fullscreen;
    emits('update:fullscreen', defData.fullscreen)
}

</script>

<style lang="scss" scoped>
.dialog-full {
    margin-right: 54px;

    // display: flex;
    // align-items: center;
    // justify-content: center;
    .dialog-full-close {
        transform: rotate(180deg);
    }

}
</style>