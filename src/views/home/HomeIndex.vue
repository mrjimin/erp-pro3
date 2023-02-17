<template>
    <my-box class="box-color">
        <div class="jm-box ">
            <div class="content">
                <img src="@/assets/images/logo_gyj.png" alt="">
                <h1 class="text">
                    <sub>欢迎进入</sub>
                    <br />&emsp;工游记后台管理系统
                </h1>
            </div>

        </div>
    </my-box>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.box-color {
    background-color: #fafafa !important;
}

.content {
    // width: 100%;
    height: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
    // flex-direction: column;

    >img {
        width: 100px;
    }

    .text {
        // margin-bottom: 80px;
        margin: 0 20px;
        font-size: 32px;
        color: #444;
        // text-align: center;
        text-shadow: 4px 4px 0px #fff,
            10px 10px 0px #cbcbcd;
        text-shadow: 0 1px 0 #ccc,
            0 2px 0 #c9c9c9,
            0 3px 0 #bbb,
            0 4px 0 #b9b9b9,
            0 5px 0 #aaa,
            0 6px 1px rgba(0, 0, 0, .1),
            0 0 5px rgba(0, 0, 0, .1),
            0 1px 3px rgba(0, 0, 0, .3),
            0 3px 5px rgba(0, 0, 0, .2),
            0 5px 10px rgba(0, 0, 0, .25),
            0 10px 10px rgba(0, 0, 0, .2),
            0 20px 20px rgba(0, 0, 0, .15);
    }
}
</style>