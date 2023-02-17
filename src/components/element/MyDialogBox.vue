<template>
    <div class="dialog-body-box">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>


</script>

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