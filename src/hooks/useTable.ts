
import type { TableColumnCtx } from "element-plus"
import { ref } from "vue";




/**
 * element-plus table组件合计方法
 * @param param 原有element-plus合计计算方法返回的参数
 * @param option 合计的数据选项，需要合计的字段、保留小数位数、合计文字显示等等
 * @returns string[]
 */
export const useTableSummaries = <T = any>(param: {
    columns: TableColumnCtx<T>[];
    data: T[];
}, option: TableSummaryContent<T>) => {
    const { columns } = param
    const data = ref(param.data)
    const sums: string[] = []
    const num = option.countText?.[0] ?? 0
    const countText = option.countText?.[1] ?? '合计'
    columns.forEach((column, index) => {
        if (index === num) return sums[index] = countText

        const textArr = Object.keys(option.data)
        const key = column.property as keyof T
        if (textArr.includes(key as string)) {
            let count = 0;
            if (option.data[key]?.value) {
                count = option.data[key]?.value ?? 0;
            } else {
                const values = data.value.map((item) => Number(item[key]))
                count = values.reduce((prev, curr) => {
                    const value = Number(curr)
                    return Number.isNaN(value) ? prev : prev + curr
                }, 0)
            }
            let num = option.precision ?? 2;  // 默认保留两位小数
            if (typeof (option.data[key]?.precision) === 'number') num = option.data[key]?.precision ?? 0
            return sums[index] = `${count.toFixed(num)}`
        }
        return sums[index] = ''
    })
    return sums
}
