<template>
    <el-dialog v-model="isShowSearch" class="layout-search-dialog" width="560px" append-to-body destroy-on-close
        close-on-click-modal :show-close="false">
        <div class="cen-box">
            <div class="operate-tips">
                <div class="tip">
                    <span>
                        <SvgIcon name="ele-Top" />
                    </span>
                    <span>
                        <SvgIcon name="ele-Bottom" />
                    </span>
                    切换搜索结果
                </div>
                <div class="tip">
                    <span>Enter</span>
                    访问页面
                </div>
                <div class="tip">
                    <span>ESC</span>
                    退出
                </div>
            </div>
            <el-autocomplete ref="layoutMenuAutocompleteRef" v-model="menuQuery" :fetch-suggestions="menuSearch"
                :teleported="false" placeholder="菜单搜索：支持中文、路由路径" @select="onHandleSelect"
                @blur="onSearchBlur">
                <template #prefix>
                    <el-icon class="el-input__icon">
                        <ele-Search />
                    </el-icon>
                </template>
                <template #default="{ item }">
                    <div class="flex-search-item">
                        <span class="ico">
                            <SvgIcon :name="item.meta.icon" />
                        </span>
                        {{ item.meta.title }}
                        <em class="url ml5">{{ item.path }}</em>
                    </div>
                </template>
            </el-autocomplete>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTagsViewRoutes } from '@/stores/tagsViewRoutes';

// 定义接口来定义对象的类型
interface SearchState {
    isShowSearch: boolean;
    menuQuery: string;
    tagsViewList: object[];
}
interface Restaurant {
    path: string;
    meta: {
        title: string;
    };
}

export default defineComponent({
    name: 'LayoutBreadcrumbSearch',
    setup() {
        const storesTagsViewRoutes = useTagsViewRoutes();
        const { tagsViewRoutes } = storeToRefs(storesTagsViewRoutes);
        const layoutMenuAutocompleteRef = ref();
        const router = useRouter();
        const state = reactive<SearchState>({
            isShowSearch: false,
            menuQuery: '',
            tagsViewList: [],
        });
        // 搜索弹窗打开
        const openSearch = () => {
            state.menuQuery = '';
            state.isShowSearch = true;
            initTagsView();
            nextTick(() => {
                setTimeout(() => {
                    layoutMenuAutocompleteRef.value.focus();
                });
            });
        };
        // 搜索弹窗关闭
        const closeSearch = () => {
            state.isShowSearch = false;
        };
        // 菜单搜索数据过滤
        const menuSearch = (queryString: string, cb: (param: object[]) => void) => {
            let results = queryString ? state.tagsViewList.filter(createFilter(queryString)) : state.tagsViewList;
            cb(results);
        };
        // 菜单搜索过滤
        const createFilter: any = (queryString: string) => {
            return (restaurant: Restaurant) => {
                return (
                    restaurant.path.toLowerCase().indexOf(queryString.toLowerCase()) > -1 ||
                    restaurant.meta.title.toLowerCase().indexOf(queryString.toLowerCase()) > -1 ||
                    restaurant.meta.title.indexOf(queryString.toLowerCase()) > -1
                );
            };
        };
        // 初始化菜单数据
        const initTagsView = () => {
            if (state.tagsViewList.length > 0) return false;
            tagsViewRoutes.value.map((v: any) => {
                if (!v.meta.isHide) state.tagsViewList.push({ ...v });
            });
        };
        // 当前菜单选中时
        const onHandleSelect = (item: any) => {
            let { path, redirect } = item;
            if (item.meta.isLink && !item.meta.isIframe) window.open(item.meta.isLink);
            else if (redirect) router.push(redirect);
            else router.push(path);
            closeSearch();
        };
        // input 失去焦点时
        const onSearchBlur = () => {
            closeSearch();
        };
        return {
            layoutMenuAutocompleteRef,
            openSearch,
            closeSearch,
            menuSearch,
            onHandleSelect,
            onSearchBlur,
            ...toRefs(state),
        };
    },
});
</script>

<style scoped lang="scss">
.cen-box {
    // width: 560px;
    margin: 0 auto;

    :deep(.el-autocomplete) {
        // width: 560px;
        // position: absolute;
        // top: 100px;
        // left: 50%;
        // transform: translateX(-50%);
        width: 100%;

    }

    :deep(.el-autocomplete-suggestion) {

        li.highlighted,
        li:hover {
            background-color: var(--el-border-color-extra-light);

        }
    }
}

.flex-search-item {
    display: flex;
    align-items: center;

    .ico {
        width: 15px;
        text-align: center;
        margin-right: 5px;
    }

    .url {

        color: var(--el-color-info-light-3);
    }
}

.operate-tips {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 15px;

    .tip {
        display: flex;
        align-items: center;
        color: #fff;
        line-height: 24px;

        span {
            margin: 0 5px;
            padding: 0 8px;
            border-radius: 5px;
            font-size: 12px;
            line-height: 24px;
            font-weight: 700;
            color: var(--el-text-color-primary);
            background-color: var(--el-fill-color);
            box-shadow: inset 0 -2px var(--el-fill-color-lighter), inset 0 0 1px 1px var(--el-fill-color-darker);

            :deep(.el-icon) {
                font-weight: bold;
                font-size: 16px;
                line-height: 24px;
                height: 24px;
                display: flex;
            }
        }

    }
}
</style>
<style lang="scss">
.layout-search-dialog {
    &.el-dialog {
        box-shadow: unset !important;
        border-radius: 0 !important;
        background: rgba(0, 0, 0, 0);
        position: fixed;
        top: 70px;
    }

    .el-dialog__header {
        display: none;
    }


}

// .el-overlay {
//     backdrop-filter: blur(5px);
// }
</style>
