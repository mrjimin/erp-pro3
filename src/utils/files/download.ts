// 文件下载
// let baseURL = process.env.VUE_APP_API_BASE_URL  //服务器地址

//通过文件下载url拿到对应的blob对象
function getBlob(url: string | URL): Promise<Blob> {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.responseType = 'blob'
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response)
            }
        }

        xhr.send()
    })
}

/**
 * 下载文件 - js模拟点击a标签进行下载
 * @param blob Blob或File格式数据
 * @param filename 下载名称
 */
export function downloadBlob(blob: Blob, filename: string) {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename
    link.click()
}


// url 文件地址后缀  fileName文件名称
export function downloadFile(fileUrl: string, fileName: string) {  //导出
    // let fileUrl = baseURL + url
    getBlob(fileUrl).then(blob => {
        downloadBlob(blob, fileName)
    })
}

/**
 * download的属性是HTML5新增的属性
 * href属性的地址必须是非跨域的地址，如果引用的是第三方的网站或者说是前后端分离的项目(调用后台的接口)，这时download就会不起作用。
 * 此时，如果是下载浏览器无法解析的文件，例如.exe,.xlsx..那么浏览器会自动下载，但是如果使用浏览器可以解析的文件，比如.txt,.png,.pdf....浏览器就会采取预览模式
 * 所以，对于.txt,.png,.pdf等的预览功能我们就可以直接不设置download属性(前提是后端响应头的Content-Type: application/octet-stream，如果为application/pdf浏览器则会判断文件为 pdf ，自动执行预览的策略)
*/



/**
 * 下载文件 - js模拟点击a标签进行下载
 * @param url 需要下载的文件地址
 * @param filename 
 */
export function downloadUrl(url: string, filename: string) {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
}