<template>
    <div class="img-mask"></div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.img-mask {
    position: absolute;
    width: 150px;
    height: 74px;
    right: 20px;
    bottom: 22px;
    user-select: none;
    background-image: url(@/assets/images/audit.png);
    background-size: 100% 100%;
    z-index: 1;
}
</style>