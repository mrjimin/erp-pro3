<template>
    <canvas ref="canvas" width="140" height="40" style="cursor: pointer;" @click="draw"></canvas>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';

const emits = defineEmits<{
    (e: 'change', param: string): void
}>()

const canvas = ref<HTMLCanvasElement>();
const state = reactive({
    codes: [] as string[],
    ctx: {} as CanvasRenderingContext2D,
    colors: ["red", "yellow", "blue", "green", "pink", "black"],
    code_Len: 4
})

const generateRandom = () => {
    state.codes = [];
    const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const charsArr = chars.split("");

    for (let i = 0; i < state.code_Len; i++) {
        const num = Math.floor(Math.random() * charsArr.length);
        state.codes.push(charsArr[num]);
    }
}

const drawLine = () => {
    const lineNumber = 3; // 线条条数
    const lineX = 140;
    const lineY = 30; // 最大线条坐标
    for (let i = 0; i < lineNumber; i++) {
        state.ctx.strokeStyle = state.colors[Math.floor(Math.random() * 5)];
        state.ctx.beginPath();
        state.ctx.moveTo(
            Math.floor(Math.random() * lineX),
            Math.floor(Math.random() * lineY)
        );
        state.ctx.lineTo(
            Math.floor(Math.random() * lineX),
            Math.floor(Math.random() * lineY)
        );
        state.ctx.stroke();
    }
}
const drawText = () => {
    state.ctx = canvas.value?.getContext("2d") as CanvasRenderingContext2D;

    state.ctx.fillStyle = "#BFEFFF";
    state.ctx.fillRect(0, 0, 140, 40);
    state.ctx.font = "20px Verdana";

    let x = 15;

    for (let i = 0; i < state.code_Len; i++) {
        state.ctx.fillStyle = state.colors[Math.floor(Math.random() * 5)];
        state.ctx.fillText(state.codes[i], x, 25);
        x = x + 30;
    }

    drawLine();
}

const draw = () => {
    generateRandom();
    drawText();

}

// 监听codes数组的变化
watch(() => state.codes, (newVal) => {
    let result = "";
    for (let i = 0; i < newVal.length; i++) {
        result += newVal[i];
    }

    let code = result.toUpperCase();
    // 传值给父组件
    emits('change', code)
})

onMounted(() => {
    draw();
})
</script>