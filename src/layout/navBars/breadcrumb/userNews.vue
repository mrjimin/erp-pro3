<template>
    <el-popover placement="bottom" trigger="click" transition="el-zoom-in-top" :width="300" :persistent="false">
        <template #reference>
            <el-badge :is-dot="isDot">
                <el-icon title="消息">
                    <ele-Bell />
                </el-icon>
            </el-badge>
        </template>
        <template #default>
            <div class="layout-navbars-breadcrumb-user-news">
                <div class="head-box">
                    <div class="head-box-title">通知</div>
                    <div v-if="defData.newsList.length > 0" class="head-box-btn" @click="onAllReadClick">全部已读</div>
                </div>
                <div class="content-box">
                    <template v-if="defData.newsList.length > 0">
                        <div v-for="item in defData.newsList" :key="item.value" class="content-box-item">
                            <div>{{ item.label }}</div>
                            <div class="content-box-msg">
                                {{ item.value }}
                            </div>
                            <div class="content-box-time">{{ item.time }}</div>
                        </div>
                    </template>
                    <el-empty v-else description="暂无通知"></el-empty>
                </div>
                <div v-if="defData.newsList.length > 0" class="foot-box" @click="onGoToGitClick">前往通知中心</div>
            </div>
        </template>
    </el-popover>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';


const defData = reactive({

    newsList: [
        // {
        //     label: '标题...',
        //     value: '简介...',
        //     time: '2020-12-08',
        // },
    ] as {
        label: '标题...',
        value: '简介...',
        time: '2020-12-08',
    }[],
});

const isDot = computed(() => {
    return defData.newsList.length > 0 ? true : false;
})

// 全部已读点击
const onAllReadClick = () => {
    defData.newsList = [];
    // emits('clear', true)
};
// 前往通知中心点击
const onGoToGitClick = () => {

};

</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user-news {
    :deep(.el-empty) {
        --el-empty-image-width: 120px;
    }

    .head-box {
        display: flex;
        border-bottom: 1px solid var(--el-border-color-lighter);
        box-sizing: border-box;
        color: var(--el-text-color-primary);
        justify-content: space-between;
        height: 35px;
        align-items: center;

        .head-box-btn {
            color: var(--el-color-primary);
            font-size: 13px;
            cursor: pointer;
            opacity: 0.8;

            &:hover {
                opacity: 1;
            }
        }
    }

    .content-box {
        font-size: 13px;

        .content-box-item {
            padding-top: 12px;

            &:last-of-type {
                padding-bottom: 12px;
            }

            .content-box-msg {
                color: var(--el-text-color-secondary);
                margin-top: 5px;
                margin-bottom: 5px;
            }

            .content-box-time {
                color: var(--el-text-color-secondary);
            }
        }
    }

    .foot-box {
        // height: 35px;
        padding-top: 10px;
        color: var(--el-color-primary);
        font-size: 13px;
        cursor: pointer;
        opacity: 0.8;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 1px solid var(--el-border-color-lighter);

        &:hover {
            opacity: 1;
        }
    }

    ::v-deep(.el-empty__description p) {
        font-size: 13px;
    }
}
</style>
