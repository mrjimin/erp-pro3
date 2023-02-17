import { regionData, CodeToText, TextToCode } from 'element-china-area-data'

/**
 * 文字形式转成地区编码
 * @param arr 
 * @returns 
 */
const ChangeToCode = (arr: string[]) => {
    if ((!arr.length) || (!arr[0]) || (!arr[1])) return []
    const codeArr: string[] = [TextToCode[arr[0]].code, TextToCode[arr[0]][arr[1]].code]

    if (arr[2]) {
        const len3 = TextToCode[arr[0]][arr[1]][arr[2]].code
        codeArr.push(len3)
    }
    return codeArr;
}

/**
 * 地区编码转成文字形式
 * @param arr 
 * @returns 
 */
const ChangeToText = (arr: string[]): string[] => {
    const textArr = arr.map(item => CodeToText[item])
    return textArr
}



export { regionData, CodeToText, TextToCode, ChangeToCode, ChangeToText }