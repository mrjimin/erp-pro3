//axios封装地址案例https://learnku.com/articles/30504
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
// import Qs from 'qs';


//创建axios的一个实例 
const service = axios.create({
    // baseURL: import.meta.env.VITE_APP_URL, //接口统一域名
    timeout: 8000, //设置超时
    headers: {
        'Content-Type': 'application/json;charset=UTF-8;',
        // 'Content-Type': 'application/x-www-form-urlencoded',
    }
})

//请求拦截器 
service.interceptors.request.use((config: AxiosRequestConfig) => {
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // const token = window.localStorage.getItem('token');
    // token && (config.headers.Authorization = token)

    // Loading();   //打开loading
    if (config.method)

        if (config.method.toLowerCase() == "post") {
            if (config.headers)

                if (config.data instanceof FormData) { //文件类,FormData传输
                    config.headers['Content-Type'] = 'multipart/form-data'; //修改`Content-Type`

                } else { //非文件类,stringify
                    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'; //修改`Content-Type`
                    // 判断传过来的是不是json格式数据
                    const newData = config.data;
                    const isJson = typeof (newData) == "object" && Object.prototype.toString.call(newData).toLowerCase() == "[object object]" && !newData.length;
                    if (isJson) {

                        // // 方式一、采用URLSearchParams对象传递
                        // let postData= new URLSearchParams()
                        // for (let key in newData) {
                        //     let dax=newData[key];
                        //     if(typeof newData[key] == "object"){
                        //         dax=JSON.stringify(newData)
                        //     }
                        //     postData.append(key,  dax)
                        // }
                        // config.data = postData;

                        // 方式二、拼接字符串的形式传递
                        let sUrl = '';
                        for (const key in newData) {
                            let dax = newData[key];
                            if (typeof newData[key] == "object") {
                                dax = JSON.stringify(newData)
                            }
                            sUrl += '&' + key + '=' + dax;
                        }
                        if (sUrl.substring(0, 1) == '&') {
                            sUrl = sUrl.substring(1);
                        }
                        config.data = sUrl;

                    }

                }

        }

    return config;
}, (error) => {

    return Promise.reject(error);
});

//响应拦截器
service.interceptors.response.use((response) => {
    //响应成功
    // 1. 根据自己项目需求定制自己的拦截
    // 2. 然后返回数据


    // Loading().close();  //关闭loading

    return response.data;
}, (error) => {
    // Loading().close();   //关闭loading
    //响应错误
    if (error.response && error.response.status) {
        const status = error.response.status
        switch (status) {
            case 400:
                console.error('请求错误');
                break;
            case 401:
                console.error('未授权，请重新登录');
                break;
            case 403:
                console.error("拒绝访问");
                break;
            case 404:
                console.error('请求地址出错');
                break;
            case 408:
                console.error('请求超时');
                break;
            case 500:
                console.error('服务器内部错误!');
                break;
            case 501:
                console.error('服务未实现!');
                break;
            case 502:
                console.error('网关错误!');
                break;
            case 503:
                console.error('服务不可用!');
                break;
            case 504:
                console.error('网关超时!');
                break;
            case 505:
                console.error('HTTP版本不受支持');
                break;
            default:
                console.error('请求失败');
        }
    } else {
        console.error('连接到服务器失败');
    }
    // throw error
    return Promise.reject(error);

});


/*** 方法封装 **********************************/
/**
 * @method post请求
 * @param {string} url 请求接口路由地址
 * @param {any} [data] 接口参数
 * @param {any} [config] 请求头部配置信息
 * @returns 
 */
const post = <T=any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return service.post<T>(url, data, { ...config })
}

/**
 * @method get请求
 * @param {string} url 请求接口路由地址
 * @param {any} [data] 接口参数
 * @param {any} [config] 请求头部配置信息
 * @returns {AxiosPromise<any>}
 */
const get = (url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<any> => {
    return service.get(url, {
        params: data,
        ...config
    })
}

/**
 * @method del删除
 * @param {string} url 请求接口路由地址
 * @param {any} [data] 接口参数
 * @param {any} [config] 请求头部配置信息
 * @returns {AxiosPromise<any>}
 */
const del = (url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<any> => {
    return service.delete(url, {
        params: data,
        ...config
    })
}
/**
 * @method put请求
 * @param {string} url 请求接口路由地址
 * @param {any} [data] 接口参数
 * @param {any} [config] 请求头部配置信息
 * @returns {AxiosPromise<any>}
 */
const put = (url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<any> => {
    return service.put(url, data, { ...config })
}

/**
 * @param {String} method  请求的方法：get、post、delete、put
 * @param {String} url     请求的url:
 * @param {Object} [data]    请求的参数
 * @param {Object} [config]  请求的配置
 * @returns {Promise}     返回一个promise对象，其实就相当于axios请求数据的返回值
 * @example http({method,url,data,config})
 */
interface paramsConfig {
    method: 'post'|'get'|'delete'|'put',
    url: string,
    data?: any,
    config?: AxiosRequestConfig
}
const http = ({
    method,
    url,
    data,
    config
}: paramsConfig): Promise<any> => {
    // method = method.toLowerCase();  //method统一转成小写，方便后面操作
    if (method == 'post') {
        return post(url, data, config)
    } else if (method == 'get') {
        return get(url, data, config)
    } else if (method == 'delete') {
        return del(url, data, config)
    } else if (method == 'put') {
        return put(url, data, config)
    } else {
        console.error('未知的method:' + method);
        return get(url, data, config)   //默认用get请求
        // return false
    }
}

export { post, get, del, put, http }
// export default http

