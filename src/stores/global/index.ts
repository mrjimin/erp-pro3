// 一些静态变量，可能多个组件会用到这个变量

// 角色标识
export const USER_ROLE = {
    root: 'super_admin', // 超级管理员
    sale: 'salesman',    // 业务员
    purchase: 'purchase',    // 采购
    finance: 'finance',    // 财务
    supplier: 'supplier',    // 供应商
    warehouse: 'warehouse',    // 仓管
    company_admin: 'company_admin',    // 管理员
}


// 来源类型：1：购货，2：销货，3：盘盈，4：盘亏，5：其他入库，6：其他出库
export const SOURCE_TYPE = [
    {
        label: '期初',
        value: 0,
    },
    {
        label: '其他入库',
        value: 1,
    }, {
        label: '其他出库',
        value: 2,
    },
    {
        label: '盘盈',
        value: 3,
    }, {
        label: '盘亏',
        value: 4,
    },
    {
        label: '入库单',
        value: 5,
    }, {
        label: '出库单',
        value: 6,
    }, {
        label: '采购退货',
        value: 7,
    }, {
        label: '销售退货',
        value: 8,
    },
];



export const STATE_DATA = [
    {
        label: '未审核',
        value: 1,
    }, {
        label: '已审核',
        value: 2,
    },
];

/**
 * 全局默认分页设置
 */
export const PAGINATION = {
    page: 1,    // 当前页面
    page_size: 20,  //每页显示的数量
    page_sizes: [20, 50, 100, 200, 500],
}

