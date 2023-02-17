

/**
 * 接口返回数据大致结构
 */
interface ResponseData<T = any> {
    /**
     * 状态码，示例：-  200 : 成功
     */
    code: number;
    /**
     * 返回文字描述，示例：-  提交成功
     */
    msg: string;
    /**
     * 返回的数据，
     */
    data: T;
}


declare interface ListPage {
    is_paging?: number; // 是否分页
    page?: number; // 当前页
    page_size?: number; // 每页数量
}

declare interface ListTotal {
    total: number; // 总数量
}



declare interface LabelOption {
    value: number;
    label: string;
    children?: LabelOption[];
}


declare type GlobalComponentSize = 'large' | 'default' | 'small'

declare type MainLayoutType = 'defaults' | 'classic' | 'transverse' | 'columns';

