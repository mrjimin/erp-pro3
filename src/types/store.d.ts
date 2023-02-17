
/**
 * 定义接口来定义对象的类型
 * `stores` 全部类型定义在这里
 */


// 用户信息
declare interface UserInfoState {
    authBtnList: string[];
    photo: string;
    roles: string[];
    time: number;
}

// 路由缓存列表
declare interface KeepAliveNamesState {
    keepAliveNames: string[];
    cachedViews: string[];
}



// TagsView 路由列表
declare interface TagsViewRoutesState {
    tagsViewRoutes: string[];
    isTagsViewCurrentFull: boolean;
}



// 布局配置
declare interface ThemeConfigState {
    isDrawer: boolean;
    primary: string;
    topBar: string;
    topBarColor: string;
    isTopBarColorGradual: boolean;
    menuBar: string;
    menuBarColor: string;
    isMenuBarColorGradual: boolean;
    columnsMenuBar: string;
    columnsMenuBarColor: string;
    isColumnsMenuBarColorGradual: boolean;
    isCollapse: boolean;
    isUniqueOpened: boolean;
    isFixedHeader: boolean;
    isFixedHeaderChange: boolean;
    isClassicSplitMenu: boolean;
    isLockScreen: boolean;
    lockScreenTime: number;
    isShowLogo: boolean;
    isShowLogoChange: boolean;
    isBreadcrumb: boolean;
    isTagsView: boolean;
    isBreadcrumbIcon: boolean;
    isTagsViewIcon: boolean;
    isCacheTagsView: boolean;
    isSortableTagsView: boolean;
    isShareTagsView: boolean;
    isFooter: boolean;
    isGrayscale: boolean;
    isInvert: boolean;
    isIsDark: boolean;
    isWaterMark: boolean;
    WaterMarkText: string;
    tagsStyle: string;
    animation: string;
    columnsAsideStyle: string;
    columnsAsideLayout: string;
    layout: MainLayoutType;
    isRequestRoutes: boolean;
    globalTitle: string;
    globalViceTitle: string;
    globalI18n: string;
    globalComponentSize: 'large' | 'default' | 'small';
}
declare interface ThemeConfigStates {
    themeConfig: ThemeConfigState;
}
