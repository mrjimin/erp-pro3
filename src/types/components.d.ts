// We suggest you to commit this file into source control
// Read more: https://github.com/vuejs/core/pull/3399
// import '@vue/runtime-core'

// // export { }

// /**
//  * 全局组件扩展
//  */
// declare module '@vue/runtime-core' {
//     export interface GlobalComponents {
//         SvgIcon: typeof import('@/components/icon/SvgIcon.vue')['default']
//         MyBox: typeof import('@/components/MyBox.vue')['default']
//         MyTable: typeof import('@/components/element/MyTable.vue')['default']
//         MyTablePage: typeof import('@/components/element/MyTablePage.vue')['default']
//         MyDialogFull: typeof import('@/components/element/MyDialogFull.vue')['default']
//         MyCascader: typeof import('@/components/element/MyCascader.vue')['default']
//     }

// }


declare type MyTableInstance = typeof import('@/components/element/MyTable.vue')['default']
// declare type MyFormTool = typeof import('@/components/element/MyFormTool.vue')['default']

