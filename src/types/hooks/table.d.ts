
 type TableSummaryContent<T> = {
    countText?: [number, string],   // 显示合计的位置和文字，[0,'合计']
    precision?: number,   // 保留小数位数
    data: {
        [key in keyof T]?: {
            value?: number,
            precision?: number,
        }
    },
}